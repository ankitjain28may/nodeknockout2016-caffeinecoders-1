<?php

namespace App\Http\Controllers;
use Jenssegers\Mongodb\Eloquent\Model;
use Illuminate\Http\Request;
use App\CheckDB;
use App\Http\Requests;
use DB;

class Check extends Controller
{
    public function index(Request $request)
    {
        // $m = new Mongodb("mongodb://localhost:3306/admin");
        // $db=$m->check;
        // $collection=$db->user;
        // $cursor=collection('users')->find("{'name':'Ankit'}");
        // return $cursor;
        // return dd(DB::connection('mongodb'));
        // $user = DB::collection('user')->all();
        // return $user;
        // return "Tue";
        return CheckDB::all();
    }
}
