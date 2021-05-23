<?php

namespace App\Http\Controllers;

use App\Models\Vehicle_brand;
use App\Models\Vehicle_version;
use App\Models\Vehicle_regdate;
use App\Models\Vehicle_car_steering;
use App\Models\Vehicle_gearbox;
use App\Models\Vehicle_fuel;
use App\Models\Vehicle_motorpower;
use App\Models\Vehicle_doors;
use App\Models\Vehicle_model;
use App\Models\Vehicle_carcolor;
use App\Models\Vehicle_exchange;
use App\Models\Vehicle_features;
use App\Models\Vehicle_financial;
use App\Models\Vehicle_cubiccms;
use App\Models\Vehicle_type;

use Illuminate\Http\Request;

class DataScraping extends Controller
{

    public function index($vehicle_type_id){
           $this->marcas($vehicle_type_id);
           $this->carro();
           $this->moto();
           $this->types();
    }

    public function marcas($vehicle_type_id){
          if($vehicle_type_id == 2020){
               $data = json_decode(file_get_contents(public_path('2020.json')));
               $vehicle_brand = $data[1];

          }

          if($vehicle_type_id == 2060){
            $data = json_decode(file_get_contents(public_path('2060.json')));
            $vehicle_brand = $data[0];
       }

       foreach($vehicle_brand->values_list as $brand){
              $marca = Vehicle_brand::firstOrCreate([
                  'label' => $brand->label,
                  'value' => $brand->value,
                  'vehicle_type_id' => $vehicle_type_id
              ]);

              foreach($brand->values as $model){
                   $modelo = Vehicle_model::firstOrCreate([
                        'brand_id' => $marca->value,
                        'label' => $model->label,
                        'value' => $model->value,
                        'vehicle_type_id' => $vehicle_type_id
                   ]);
                foreach( $model->values as $version ){
                      Vehicle_version::firstOrCreate([
                         'brand_id' => $marca->value,
                          'model_id' => $modelo->value,
                          'label' => $version->label,
                          'value' => $version->value
                      ]);
                }
              }
       }
    }

    public function carro(){
        $data = json_decode(file_get_contents(public_path('2020.json')));

        $array = [
           [
              'data' => $data[2],
              'class' => Vehicle_regdate::class
            ],
            [
               'data' => $data[3],
               'class' => Vehicle_gearbox::class
            ],
            [
                'data' => $data[4],
                'class' => Vehicle_fuel::class
            ],
            [
                'data' => $data[5],
                'class' => Vehicle_car_steering::class
            ],
            [
                'data' => $data[6],
                'class' => Vehicle_motorpower::class
            ],
            [
                'data' => $data[9],
                'class' => Vehicle_doors::class
            ],
            [
                'data' => $data[12],
                'class' => Vehicle_carcolor::class
            ],
            [
                'data' => $data[14],
                'class' => Vehicle_exchange::class
            ],
            [
                'data' => $data[15],
                'class' => Vehicle_financial::class
            ],

        ];

        foreach($array as $item){
              $item = (object) $item;

              foreach($item->data->values_list as $value){
                      $valid = $item->class::where('value', $value->value)->first();

                      if(empty($valid)){
                          $item->class::create((array) $value);
                      }
              }
        }

        foreach($data[11]->values_list as $features_car){
                $valid = Vehicle_features::where('value', $features_car->value)
                          ->where('vehicle_type_id', 2020)
                          ->first();
                $features_car->vehicle_type_id = 2020;

                if(empty($valid)){
                    Vehicle_features::create((array) $features_car);
                }


        }
    }

    public function moto(){
        $data = json_decode(file_get_contents(public_path('2060.json')));

        foreach($data[3]->values_list as $value){
              $valid = Vehicle_cubiccms::where('value', $value->value)->first();

              if(empty($valid)){
                Vehicle_cubiccms::create((array) $value);
              }
        }
        foreach($data[5]->values_list as $moto_features){
            $valid = Vehicle_features::where('value', $moto_features->value)
                      ->where('vehicle_type_id', 2060)
                      ->first();

                      $moto_features->vehicle_type_id = 2060;

            if(empty($valid)){
                Vehicle_features::create((array) $moto_features);
            }


    }
    }

    public function types(){
         $data = [
            [
                'label' => 'Carros, vans e utilitários',
                'value' => 2020
            ],
            [
               'label' => 'Moto',
               'value' => 2060
           ],
         ];

         foreach($data as $item){
               $valid = Vehicle_type::where('value', $item['value'])->first();

               if(empty($valid)){
                    Vehicle_type::create($item);
               }
         }
    }
}
