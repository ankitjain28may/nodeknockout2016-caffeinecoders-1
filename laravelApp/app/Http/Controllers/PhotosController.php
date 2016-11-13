<?php

namespace App\Http\Controllers;
use App\Photos;
use Illuminate\Http\Request;

class PhotosController extends Controller
{
    public function save($id)
    {

    }

    public function show($id)
    {
        $photo = Photos::find($id);
        return $photo;
    }

    public function photos($id)
    {
        $user = Photos::where('UserId',$id)->get();
        return $user;
    }
}
