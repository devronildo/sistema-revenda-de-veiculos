<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notes extends Model
{
    use HasFactory;

    protected $table = 'notes';
    protected $guarded = ['id'];

    static $rules = [
         'content' => 'required'
    ];

    public function user(){
         return $this->hasOne('App\Models\User', 'id', 'user_id')->select('id', 'name');
    }
}
