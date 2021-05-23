<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class Json implements CastsAttributes
{

    public function get($model, $key, $value, $attributes)
    {
        return $value ? json_decode($value, true) : new \stdClass;
    }


    public function set($model, $key, $value, $attributes)
    {
        return json_encode($value);
    }
}
