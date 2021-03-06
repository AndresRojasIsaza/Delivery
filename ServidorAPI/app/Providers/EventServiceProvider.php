<?php

namespace Shipper\Providers;

use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'Shipper\Events\EventoCambioUbicacion' => [
            'Shipper\Listeners\ListenerCambioUbicacion',
        ],
        'Shipper\Events\EventMensaje' => [
            'Shipper\Listeners\MensajeListener',
        ],
        'Shipper\Events\EventDisponibilidadDelivery' => [
            'Shipper\Listeners\DisponibilidadDeliveryListener',
        ],
        'Shipper\Events\EventDisponibilidadComercio' => [
            'Shipper\Listeners\DisponibilidadComercioListener',
        ],
    ];

    /**
     * Register any other events for your application.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $events
     */
    public function boot(DispatcherContract $events)
    {
        parent::boot($events);

        //
    }
}
