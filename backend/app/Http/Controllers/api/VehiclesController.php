<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Vehicle_type;
use App\Models\Vehicle_regdate;
use App\Models\Vehicle_gearbox;
use App\Models\Vehicle_fuel;
use App\Models\Vehicle_car_steering;
use App\Models\Vehicle_motorpower;
use App\Models\Vehicle_doors;
use App\Models\Vehicle_features;
use App\Models\Vehicle_carcolor;
use App\Models\Vehicle_exchange;
use App\Models\Vehicle_financial;
use App\Models\Vehicle_cubiccms;
use App\Models\Vehicle_brand;
use App\Models\Vehicle_model;
use App\Models\Vehicle_version;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;


class VehiclesController extends Controller
{

    protected $user;

    public function __construct(){

             $this->user = Auth()->guard('api')->user();

    }

    private function getData(){
         return [
              'vehicle_types' => Vehicle_type::all(),
              'regdate' => Vehicle_regdate::orderBy('label', 'ASC')->get(),
              'gearbox' => Vehicle_gearbox::all(),
              'fuel' => Vehicle_fuel::all(),
              'car_steering' => Vehicle_car_steering::all(),
              'motorpower' => Vehicle_motorpower::all(),
              'doors' => Vehicle_doors::all(),
              'features' => Vehicle_features::all(),
              'carcolor' => Vehicle_carcolor::all(),
              'exchange' => Vehicle_exchange::all(),
              'financial' => Vehicle_financial::all(),
              'cubiccms' => Vehicle_cubiccms::all(),

         ];
    }

    public function index(Request $request)
    {
         $vehicles = Vehicle::where('user_id', $this->user->id)
                    ->where('status', 1);

              if($request->owner_id){
                   $vehicles->where('vehicle_owner', $request->owner_id);
              }

         $vehicles = $vehicles->with(
                        'cover',
                        'vehicle_owner',
                        'vehicle_brand',
                        'vehicle_fuel',
                        'vehicle_color',
                        'vehicle_gearbox'
                    )
                    ->paginate(env('APP_PAGINATE'));

         $vehicles->transform(function($vehicle) {
            $vehicle->vehicle_model = $vehicle->vehicle_model();
            $vehicle->vehicle_version = $vehicle->vehicle_version();
            return $vehicle;
         });

         return compact('vehicles');
    }


    public function store()
    {
         $vehicle = Vehicle::with(['vehicle_photos'])
                         ->firstOrCreate([
                              'user_id' => $this->user->id,
                              'status' => 0
                         ]);

            $vehicle = $vehicle->fresh('vehicle_photos');

          return array_merge(['vehicle' => $vehicle], $this->getData());

    }


    public function show($id)
    {
        $vehicle = Vehicle::where('user_id', $this->user->id)
                   ->with('vehicle_photos')
                   ->find($id);
             if($vehicle->id){
                $vehicle_brand = $this->brand($vehicle->vehicle_type);
                $vehicle_model = $this->model($vehicle->vehicle_type, $vehicle->vehicle_brand);
                $vehicle_version = $this->version($vehicle->vehicle_brand, $vehicle->vehicle_model);

                return array_merge(['vehicle' => $vehicle], $vehicle_brand, $vehicle_model, $vehicle_version, $this->getData());
             }

             return $this->error('Veiculo não encontrado');
    }


    public function update(Request $request, $id)
    {

        $vehicle = Vehicle::where('user_id', $this->user->id)
        ->find($id);

        if($request->update_owner){
            $vehicle->vehicle_owner = $request->vehicle_owner;

            if($vehicle->save()){
                return $this->success('Dados atualizado com succeso');
              }
        }

        $request['vehicle_photos'] = $id;
        $validator = Validator::make($request->all(), Vehicle::$rules);

         if($validator->fails()){
           return response()->json(['error' => $validator->errors()], 200);
         }



           if($vehicle->id){
                  $vehicle->fill($request->all());
                  $vehicle->status = 1;
                  $vehicle->uf_url = $this->validateUrl($request->uf);
                  $vehicle->city_url = $this->validateUrl($request->city);

                  if($vehicle->save()){
                    return $this->success('Dados atualizado com succeso');
                  }

                  return $this->error('Erro ao atualizar dados');
           }

           return $this->error('Veiculo não encontrado');

    }

    public function destroy($id)
    {
        $vehicle = Vehicle::where('user_id', $this->user->id)
                   ->with('vehicle_photos')
                   ->find($id);

         if($vehicle->id){
                $dir = 'vehicles/'.$this->user->id.'/'.$id;

                if($vehicle->vehicle_photos()->delete()){
                  Storage::deleteDirectory($dir);
                }
                if($vehicle->delete()){
                   return $this->success('Veiculo excluido com sucesso');
                }
                return $this->error('Erro ao excluir veiculo');

         }

         return $this->error('Veiculo não encontrado');
    }

    public function brand($vehicle_type){
        $vehicle_brand = Vehicle_brand::where('vehicle_type_id', $vehicle_type)
                         ->get();

         return compact('vehicle_brand');
    }

    public function model($vehicle_type, $vehicle_brand){
           $vehicle_model = Vehicle_model::where('vehicle_type_id', $vehicle_type)
                                         ->where('brand_id', $vehicle_brand)
                                         ->orderBy('label')
                                         ->get();

           return compact('vehicle_model');
    }
     public function version($vehicle_brand, $vehicle_model){
           $vehicle_version = Vehicle_version::where('brand_id', $vehicle_brand)
                                             ->where('model_id', $vehicle_model)
                                             ->orderBy('label')
                                             ->get();

            return compact('vehicle_version');
     }

}
