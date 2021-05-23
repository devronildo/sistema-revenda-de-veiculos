<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Units extends Model
{
    use HasFactory;

    protected $table = 'units';
    protected $guarded = ['id'];

    static $rules = [
       'phone' => 'required|min:13',
       'uf' => 'required',
       'city' => 'required',
       'neighborhood' => 'required'
    ];
}
