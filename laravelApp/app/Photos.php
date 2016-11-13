<?php

namespace App;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Model;

class Photos extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'photos';
}
