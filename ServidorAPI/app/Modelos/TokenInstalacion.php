<?php

namespace Shipper\Modelos;

use Jenssegers\Mongodb\Eloquent\SoftDeletes;

class TokenInstalacion extends \Moloquent
{
    //Bloque de Use
    use SoftDeletes;

    /**
     * Llave primaria de la tabla.
     * 
     * @var string
     */
    protected $primaryKey = '_id';

    /**
     * Arreglo de fechas para que sean manejadas
     * como un tipo de fecha válido para Mongo
     * Carbon/DateTime.
     * 
     * @var array[string]
     */
    protected $dates = ['deleted_at'];

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'TokenInstalacion';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'mac',
        'token',
        'estado',
        'msgData',
        'numero',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [

    ];

    /**
     * Validador.
     */
    private $errors;
    private $rules = [];
    private $messages = [];

    public function validate($data)
    {
        // make a new validator object
        $v = \Validator::make($data, $this->rules);

        // check for failure
        if ($v->fails()) {
            // set errors and return false
            $this->errors = $v->errors();

            return false;
        }

        // validation pass
        return true;
    }

    public function errors()
    {
        return $this->errors;
    }
}
