<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Units;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class UnitsController extends Controller
{

    protected $user;

    public function __construct(){
         $this->user = Auth()->guard('api')->user();
    }


    public function index()
    {
        $units = Units::where('user_id', $this->user->id)
                   ->get();

         return compact('units');
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Units::$rules);

        if($validator->fails()){
             return response()->json(['error' => $validator->error()], 200);
        }

        $unit = new Units();
        $unit->user_id = $this->user->id;
        $unit->fill($request->all());
        $unit->save();

        if($unit->id){
              return $unit;
        }

        return $this->error('Erro ao cadastrar unidade');
    }


    public function show($id)
    {
        $unit = Units::where('user_id', $this->user->id)
                ->find($id);

        if($unit->id){
           return compact('unit');
        }

        return $this->error('Unidade não encontrada');
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), Units::$rules);
        if($validator->fails()){
             return response()->json(['error' => $validator->error()], 200);
        }

        $unit = Units::where('user_id', $this->user->id)
                ->find($id);

        if($unit->id){
            $unit->fill($request->all());
            if($unit->save()){
               return $this->success('Dados atualizados com sucesso');
            }
            return $this->error('Error ao atualizar dados');
        }

        return $this->error('Unidade não encontrada');
    }

    public function destroy($id)
    {
        $unit = Units::where('user_id', $this->user->id)
                ->find($id);

         if($unit->id){
            if($unit->delete()){
                return $this->success('Unidade excluida com sucesso');
            }
            return $this->error('Error ao excluir dados');
         }

         return $this->error('Error ao atualizar dados');


    }
}
