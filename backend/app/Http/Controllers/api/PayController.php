<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Plans;
use Illuminate\Http\Request;

class PayController extends Controller
{
    protected $user;

    public function __construct(){
         $this->user = Auth()->guard('api')->user();
    }

    public function plans(){
         $plans = Plans::all();

         return compact('plans');
    }

}
