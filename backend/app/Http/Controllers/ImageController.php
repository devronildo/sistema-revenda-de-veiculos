<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class ImageController extends Controller
{
    public function thumb(Request $request, $path = null, $img =null)
    {
        $user = ($request->u) ? (int) $request->u.'/' : '';
        $subPath = ($request->s) ? $request->s.'/' : '';
        $width = ($request->w) ? (int) $request->w : null;
        $height = ($request->h) ? (int) $request->h : null;
        $path = $path.'/'.$user.$subPath.$img;
        $url = Storage::get($path);

        if(!$width && !$height) {
            $imagem = Image::cache(function($image) use($url) {
                $image->make($url);
            });
        }else {
            $imagem = Image::cache(function($image) use($url, $width, $height) {
                if($width && $height) {
                    $image->make($url)->fit($width, $height);
                }else {
                    $image->make($url)
                    ->resize($width, $height, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                }
            });
        }

        if(isset($imagem)) {
            return Response::make($imagem, 200, ['Content-Type' => 'image'])
                    ->setMaxAge(864000)
                    ->setPublic();
        }
    }
}
