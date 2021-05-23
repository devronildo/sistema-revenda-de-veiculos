<?php

namespace App\Http\Controllers\api\uploads;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class LogoController extends Controller
{
    protected $user;

     public function __construct(){
         $this->user = Auth()->guard('api')->user();
     }

     public function store(Request $request){
        $fileName = md5(uniqid(time())).'png';
        $img = Image::make($request->file)->orientate();
        $img->resize(300, null, function ($constraint){
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        Storage::put('logo/'.$this->user->id.'/'.$fileName, $img->encode(), 'public');

        $this->user->logo = $fileName;

        if($this->user->save()){
             return response()->json(['logo' => $fileName], 200);
        }

     }

     public function destroy($id){
       $logo = 'logo/'.$this->user->id.'/'.$this->user->logo;

       if(Storage::exists($logo)){
            Storage::delete($logo);
       }

       $this->user->logo = null;

       if($this->user->save()){
          return $this->success('Logo apagada com sucesso');
       }
    }

}
