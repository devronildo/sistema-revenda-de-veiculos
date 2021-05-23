<?php

namespace App\Models;

use App\Casts\Json;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $casts = [
       'vehicle_features' => Json::class,
       'vehicle_financial' => Json::class
    ];

    protected $guarded = ['id'];

    static $rules = [
         'zipCode' => 'required',
         'city' => 'required',
         'uf' => 'required',
         'vehicle_type' => 'required',
         'vehicle_brand' => 'required',
         'vehicle_model' => 'required',
         'vehicle_version' => 'required',
         'vehicle_price' => 'required',
         'vehicle_photos' => 'exists:vehicle_photos,vehicle_id'
    ];

    public function cover(){
         return $this->hasOne('App\Models\Vehicle_photos', 'vehicle_id', 'id')->orderBy('order', 'ASC');
    }

    public function vehicle_brand(){
         return $this->hasOne('App\Models\Vehicle_brand', 'value', 'vehicle_brand');
    }
    public function vehicle_owner(){
        return $this->hasOne('App\Models\Owners', 'id', 'vehicle_owner');
    }

    public function vehicle_model(){
         return Vehicle_model::where('value', $this->vehicle_model)
                              ->where('brand_id', $this->vehicle_brand)
                              ->first();
    }

    public function vehicle_version(){
         return Vehicle_version::where('value', $this->vehicle_version)
                                ->where('brand_id', $this->vehicle_brand)
                                ->where('model_id', $this->vehicle_model->value)
                                ->first();
    }

    public function vehicle_color(){
        return $this->hasOne('App\Models\Vehicle_carcolor', 'value', 'vehicle_color');
    }

    public function vehicle_fuel(){
        return $this->hasOne('App\Models\Vehicle_fuel', 'value', 'vehicle_fuel');
    }

    public function vehicle_gearbox(){
        return $this->hasOne('App\Models\Vehicle_gearbox', 'value', 'vehicle_gearbox');
    }


    public function vehicle_photos(){
          return $this->hasMany('App\Models\Vehicle_photos', 'vehicle_id', 'id')->orderBy('order', 'ASC');
    }
}
