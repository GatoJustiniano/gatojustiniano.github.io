<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ClaseRandom extends Model
{
    public function getFechaVencimientoToken()
    {
        $formato_fecha = GeneralSetting::first()->date_format;

        $fecha = new Carbon($this->fecha_vencimiento_token);
        $fecha = $fecha->format("$formato_fecha H:i");
        return $fecha;
    }
}
