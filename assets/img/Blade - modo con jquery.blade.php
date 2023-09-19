@extends('layout.main')
@section('content')


@include('layout.partials.session-flash')

<section>
    <div class="container-fluid">

        <h4 class="fw-bold py-3 mb-4">
            <span class="text-muted fw-light">Ventas / Modo Contingencia /</span> Evento 
        </h4>
        <div class="row">

            <div class="col-3">
                <p>El proceso de registro de evento significativo permite informar al SIN de la contingencia del Sistema Informático de Facturación autorizado.</p>
            </div>

            <!-- Modo Contingencia -->
            <div class="col-6">
                <div class="card mb-4">
                    <h5 class="card-header">Modo contingencia</h5>
                    <div class="card-body">
                        <p class="card-title">Modo</p>
                        <p class="card-text">* Las ventas realizadas continuarán en modo contingencia, 
                            que una vez se restablezcan los servicios, se enviarán por paquetes.</p>

                        <button type="button" class="btn btn-danger "
                            data-toggle="modal" data-target="#addControlContingencia">
                            <i class="dripicons-plus"></i>Entrar en modo contingencia
                        </button>
                        <button class="btn btn-outline-success" type="button" onclick="getEstadoSIN()"><i class="dripicons-search"></i>
                            Verificar estado del SIN
                        </button>
                        <p class="card-text"><small class="text-muted">Hasta que se reestablezcan los servicios.</small></p>
                    </div>
                </div>
            </div>
            
            <!--/ Modo Contingencia -->
            <div class="col">
                <p>Las facturas emitidas se almacenan en paquetes que posteriormente serán enviados a la administración Tributaria, cuando la contingencia se haya superado. (Obtener un nuevo CUFD antes de registrar el evento significativo y enviar los paquetes, a fin de evitar posibles inconvenientes relacionados al tiempo de vigencia del CUFD durante el envío de los mismos de no hacerlo).</p>
            </div>
        </div>

        <hr>
        <div class="row">
            <div class="col">
                <div class="table-responsive">
                    <table id="modo-table" class="table">
                        <thead>
                            <tr>
                                <th>Sucursal</th>
                                <th>Punto de Venta</th>
                                <th>Fecha inicio</th>
                                <th>Fecha fin</th>
                                <th>Estado </th>
                                <th class="not-exported">{{trans('file.action')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($c_contingencias as $key=>$contingencia)
                            <tr data-id="{{$contingencia->id}}">
                                <td>{{ $contingencia->getNombreSucursal() }}</td>
                                <td>{{ $contingencia->getNombrePuntoVenta() }}</td>
                                <td>{{ $contingencia->getFechaInicio() }}</td>
                                <td>{{ $contingencia->getFechaFin() }}</td>
                                <td>{{ $contingencia->estado }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{trans('file.action')}}
                                            <span class="caret"></span>
                                            <span class="sr-only">Toggle Dropdown</span>
                                        </button>
                                        <ul class="dropdown-menu edit-options dropdown-menu-right dropdown-default" user="menu">
                                            @if ($contingencia->estado == 'EN_PROCESO')
                                                <li>
                                                    <button type="button" class="registrar-evento-modal btn btn-link" data-id = "{{$contingencia->id}}" data-toggle="modal" data-target="#registrar-evento-modal"><i class="fa fa-plus-square-o"></i> Registrar Evento </button>
                                                </li>
                                            @endif
                                            @if ($contingencia->estado == 'EVENTO_REGISTRADO')
                                                <li>
                                                    <button type="button" class="enviar-evento-modal btn btn-link" data-id = "{{$contingencia->id}}" data-toggle="modal" data-target="#enviar-evento-modal"><i class="fa fa-plus-square-o"></i> Enviar Paquetes </button>
                                                </li>
                                            @endif
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

</section>
    <!-- add ControlContingencia modal -->
    <div id="addControlContingencia" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true" class="modal fade text-left">
        <div role="document" class="modal-dialog">
            <div class="modal-content">
                {!! Form::open(['route' => 'contingencia.store', 'method' => 'post']) !!}
                <div class="modal-header">
                    <h5 id="exampleModalLabel" class="modal-title">Registrar Evento Significativo</h5>
                    <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span
                            aria-hidden="true"><i class="dripicons-cross"></i></span></button>
                </div>
                <div class="modal-body">
                    <p class="italic">
                        <small>{{ trans('file.The field labels marked with * are required input fields') }}.</small>
                    </p>
                    <div class="row">
                        <div class="form-group col">
                            <label>Tipo Evento *</label>
                            <select name="codigo_evento" id="codigo_evento" class="form-control" title="Seleccionar...">
                                @foreach ($parametricas as $evento)
                                    <option value="{{ $evento->codigo_clasificador }}">{{ $evento->descripcion }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group col">
                            <label>Fecha inicio *</strong> </label>
                            <input type="datetime-local" name="fecha_inicio_evento" class="form-control" value="{{$fecha_actual}}" max="{{$fecha_actual}}" min="{{ $fecha_actual->subDays(3) }}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Descripción *</strong> </label>
                        <textarea rows="2" class="form-control" name="descripcion" placeholder="Ingrese una descripción del evento..."></textarea>
                    </div>
                    
                    <div class="row">
                        <div class="form-group col">
                            <label>Sucursal *</label>
                            <select name="sucursal" id="sucursal" class="form-control" title="Seleccionar...">
                                @foreach ($sucursales as $sucursal)
                                    <option value="{{ $sucursal->sucursal }}">{{ $sucursal->sucursal }} | {{ $sucursal->nombre }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group col">
                            <label>Codigo Punto Venta *</label>
                            <select name="codigo_punto_venta" id="codigo_punto_venta" class="form-control selectpicker" title="Seleccionar...">
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group mt-3">
                        <input type="submit" value="{{ trans('file.submit') }}" class="btn btn-primary">
                    </div>
                </div>
                {{ Form::close() }}
            </div>
        </div>
    </div>

    <!-- modal registrarEventoSignificativo modal -->
    <div id="registrar-evento-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
        class="modal fade text-left">
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="exampleModalLabel" class="modal-title"> Evento Significativo  </h5>
                    <button type="button" data-dismiss="modal" aria-label="Close" class="close">
                        <span aria-hidden="true">
                            <i class="dripicons-cross"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="italic">
                        <small>
                            Este proceso registrará al SIN el evento significativo.* 
                        </small>
                    </p>
                    <div class="modal-footer">
                        <div>
                            <b>
                                ¿Está seguro?
                            </b> 
                        </div>
                        <div class="">
                            <form id="formRegistrarEvento" action="{{ route('contingencia.registrar-evento',0) }}" method="POST" data-action="{{ route('contingencia.registrar-evento',0) }}" >
                                @method('GET')
                                @csrf
                                <input type="submit" value="Confirmar" class="btn btn-danger">
                            </form>
                        </div>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{{__('file.Close')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- modal enviarPaquetesContingencia modal -->
    <div id="enviar-evento-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
        class="modal fade text-left">
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="exampleModalLabel" class="modal-title"> Enviar Paquetes  </h5>
                    <button type="button" data-dismiss="modal" aria-label="Close" class="close">
                        <span aria-hidden="true">
                            <i class="dripicons-cross"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="italic">
                        <small>
                            Este proceso enviará los siguientes paquetes al SIN.* 
                        </small>
                    </p>
                    {{-- Insertando datos en forma de tabla --}}
                    <div id="paquete_modal" class="table-responsive">
                        @include('layout.partials.spinner-ajax')
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Paquete/Facturas</th>
                                    <th>Cantidad </th>
                                    <th>Paso 1 </th>
                                    <th>Paso 2 </th>
                                    <th>Estado </th>
                                </tr>
                            </thead>
                            <tbody>
                                {{-- Llenado por ajax jquery --}}
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        {{-- <div>
                            <b>
                                ¿Está seguro?
                            </b> 
                        </div> --}}
                        <div class="">
                            <form id="formCerrarEvento" action="{{ route('contingencia.cerrar_evento',0) }}" method="POST" data-action="{{ route('contingencia.cerrar_evento',0) }}" >
                                @method('GET')
                                @csrf
                                <input hidden id="cerrarContigencia" type="submit" value="Confirmar cierre de contingencia" class="btn btn-danger">
                            </form>
                        </div>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{{__('file.Close')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script >
        $("ul#sale").siblings('a').attr('aria-expanded', 'true');
        $("ul#sale").addClass("show");
        $("ul#sale #contingencia-menu").addClass("active");

        var MAX_paquetes = 0;
        var CANT_paquetes_enviados = 0;

        $('#modo-table').DataTable( {
            "order": [],
            'language': {
                'lengthMenu': '_MENU_ {{trans("file.records per page")}}',
                "info":      '<small>{{trans("file.Showing")}} _START_ - _END_ (_TOTAL_)</small>',
                "search":  '{{trans("file.Search")}}',
                'paginate': {
                        'previous': '<i class="dripicons-chevron-left"></i>',
                        'next': '<i class="dripicons-chevron-right"></i>'
                }
            }
        } );
        
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        function getEstadoSIN() {
            var url = '{{ route("estado_servicios_sin") }}';
            $.ajax({
                url: url,
                type: "GET",
                success:function(data) {
                    if (data == true) {
                        swal("Servicios en línea!", "verdadero!", "success");
                    } else {
                        swal("Servicios caídos!", "falso!", "warning");
                    }
                }
            });
        }
        // Copiar label de tipo de evento a descripcion
        $('#codigo_evento').on('change', function () {
            var texto_codigo_evento = $('#codigo_evento option:selected').text();
            $('textarea[name="descripcion"]').val(texto_codigo_evento);
        })

        // Cuando se seleccione una sucursal, mostrar sus puntos de ventas respectivos. 
        $('#sucursal').on('change', function () {
            var id = $(this).val();
            var url = '{{ route("getPuntosVentas", ":id") }}';
            url = url.replace(':id', id);

            $("select[name='codigo_punto_venta']").empty();
            
            $.ajax({
                url: url,
                type: "GET",
                success:function(data) {
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        $("select[name='codigo_punto_venta']").append('<option value="'+ data[i].codigo_punto_venta +'">'+ data[i].codigo_punto_venta +' - '+data[i].nombre_punto_venta +'</option>');
                    };
                    $('.selectpicker').selectpicker('refresh');

                }
            });
        })
        
        // funcion para modal registrar evento
        $(document).on("click", ".registrar-evento-modal", function(event) {
            var id = $(this).data('id').toString();
            action = $('#formRegistrarEvento').attr('data-action').slice(0,-1)
            $('#formRegistrarEvento').attr('action',action + id )
            $('#registrar-evento-modal').modal('show');
        });

        // Modal para mostrar los paquetes que se enviaran de determinado control_contingencia
        $(document).on("click", ".enviar-evento-modal", function(event) {
            var id = $(this).data('id').toString();


            // obtener y rellenar tabla en el modal de información
            var url = '{{ route("contingencia.obtener_paquetes", ":id") }}';
            url = url.replace(':id', id);
            
            $.ajax({
                url: url,
                type: "GET",
                success:function(data) {
                    $("#paquete_modal").find("tr:gt(0)").remove();
                    
                    $.each(data, function (key, value) {    
                        var estadoPaquete = "";   
                        estadoPaquete = value['estado'];   
                        console.log('LA variable es: '+ estadoPaquete);
                        console.log("VALIDADA" === estadoPaquete);
                        var textoHtmlEstado = "";
                        if (estadoPaquete == "VALIDADA") {
                            textoHtmlEstado = '<td> <button id="paso_one_'+value['id']+'" type="button" class="enviar-paquete btn btn-danger" data-id = "' + value['id'] + '" disabled ><i class="fa fa-paper-plane-o"></i> ' + "Enviar Paquete" + '</button> </td>' ;
                                
                        } else {
                            textoHtmlEstado = '<td> <button id="paso_one_'+value['id']+'" type="button" class="enviar-paquete btn btn-danger" data-id = "' + value['id'] + '" ><i class="fa fa-paper-plane-o"></i> ' + "Enviar Paquete" + '</button> </td>' ;
                        }
                        var htmlTags = '<tr>'+
                            '<td>' + value['glosa_nro_factura_inicio_a_fin'] + '</td>'+
                            '<td>' + value['cantidad_ventas'] + '</td>' +
                            textoHtmlEstado +
                            '<td> <button id="paso_dos_'+value['id']+'" type="button" class="validar-paquete btn btn-info" data-id = "' + value['id'] + '"><i class="fa fa-search"></i> ' + "Validar Paquete" + '</button> </td>' +
                            '<td id="estado_'+value['id']+'">' + value['estado'] + '</td>' +
                        '</tr>';
                    $('#paquete_modal tbody').append(htmlTags);
                    
                    // asignamos la cantidad de paquetes
                    MAX_paquetes = data.length;
                    });
                }
            });




            // Boton para cerrar el evento del modo contingencia
            action = $('#formCerrarEvento').attr('data-action').slice(0,-1)
            $('#formCerrarEvento').attr('action',action + id )
            $('#enviar-evento-modal').modal('show');
        });
        


        // Procedimiento para enviar paquete individual por ajax (segundo plano) mientras mostramos un loading, cuando termine el proceso
        // ocultar el spinner
        $(document).on("click", ".enviar-paquete", function(event) {
            var id = $(this).data('id').toString();
            var url_data = "{{ route('contingencia.enviar_paquetes', ':id') }}";
            url_data = url_data.replace(':id', id);
            
            $("#spinner-div").show(); //Mostrar icon spinner de cargando
            $.ajax({
                url: url_data, 
                type: "GET",
                success: function (data) {
                    $("#estado_"+id).text(data);
                    swal('Estado de envio: ', data);
                },
                complete: function () {
                    $("#spinner-div").hide(); //Ocultar icon spinner de cargando
                },
                error: function () {
                    swal('Error', 'error en el servicio'); 
                },
            });
        });

        // Botón para permitir validar/verificar si el paquete está validado | observado | rechazado 
        $(document).on("click", ".validar-paquete", function(event) {
            var id = $(this).data('id').toString();
            var url_data = "{{ route('contingencia.verificar_paquete', ':id') }}";
            url_data = url_data.replace(':id', id);
            
            $("#spinner-div").show(); //Mostrar icon spinner de cargando
            $.ajax({
                url: url_data, 
                type: "GET",
                success: function (data) {
                    $("#estado_"+id).text(data);
                    if (data === 'VALIDADA') {
                        $("#paso_one_"+id).prop('disabled', true);
                        $("#paso_dos_"+id).prop('disabled', true);
                        CANT_paquetes_enviados++;
                    }
                    swal('Estado del paquete: ', data).then((value) => {
                        console.log('Se podrá simular que el botón de cerrar contingencia se pulse sólo');
                        triggerCerrarContingencia();
                        //$('#enviar-evento-modal').modal('hide');
                        //$("#cerrarContigencia").trigger("click");
                    });
                },
                complete: function () {
                    $("#spinner-div").hide(); //Ocultar icon spinner de cargando
                },
                error: function () {
                    swal('Error', 'error en el servicio'); 
                },
            });
        });

        function triggerCerrarContingencia() {
            if (CANT_paquetes_enviados == MAX_paquetes) {
                $("#cerrarContigencia").trigger("click");
            }
        }

    </script>

@endsection
