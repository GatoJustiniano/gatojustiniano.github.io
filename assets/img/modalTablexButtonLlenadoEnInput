<!-- Vista Formulario -->
<div class="col-md-8">
    <div class="form-group">
        <label>Autorización Facturación *</strong> </label> 
        <div class="input-group">
            <input type="hidden" id="id_autorizacion_facturacion" name="id_autorizacion_facturacion" class="form-control" value="{{ old('id_autorizacion_facturacion',$sucursal->id_autorizacion_facturacion) }}">
            <input type="text" id="texto_facturacion" name="texto_facturacion" readonly class="form-control" placeholder="Seleccionar..." aria-label="Seleccionar..." aria-describedby="button-addon2" 
            @if ($sucursal->getCodigoAutorizacion)
                value="{{$sucursal->getCodigoAutorizacion->codigo_sistema}}" 
            @endif>
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" data-toggle="modal" data-target="#exampleModal" id="button-addon2"><i class="dripicons-search"></i></button>
            </div>
        </div>
    </div>
</div>
<div class="col-12 mt-3">
    <div class="form-group">
        <input type="submit" value="{{trans('file.submit')}}" id="submit-btn" class="btn btn-primary">
    </div>
</div>
<!--Fin Vista Formulario -->



<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Autorización/Facturación</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                {{-- Insertando datos en forma de tabla --}}
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Fecha Solicitud</th>
                                <th>Ambiente</th>
                                <th>Código Sistema</th>
                                <th>Fecha Vencimiento</th>
                                <th>Modalidad</th>
                                <th>Sistema</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($items as $item)
                                <tr>    
                                    <td>{{ $item->getFechaModalidad() }}</td>
                                    <td>{{ $item->getAmbiente() }}</td>
                                    <td>
                                        <button type="button" 
                                            data-id="{{$item->id}}"
                                            data-codigo_sistema="{{$item->codigo_sistema}}" 
                                            data-fecha_vencimiento_token="{{$item->getFechaVencimientoToken()}}" 
                                            data-modalidad="{{$item->getModalidad()}}" 
                                            class="item-btn btn btn-link"
                                            data-toggle="modal" data-target="#siatModal">
                                            <i class="dripicons-document-edit"></i> 
                                        </button>
                                        {{ $item->codigo_sistema }}
                                    </td>
                                    <td>{{ $item->getFechaVencimientoToken() }}</td>
                                    <td>{{ $item->getModalidad() }}</td>
                                    <td>{{ $item->getSistema() }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>
<!-- Fin Modal -->



<!-- Script que permite rellenar datos, cuando se le click  -->
<script>
    //Rellenar el input de Autorización/Facturación, uno es oculto para guardar el ID, y el otro solo es decorativo
    $('.item-btn').on('click', function(){
        $("input[name='id_autorizacion_facturacion']").val($(this).data('id'));
        $("input[name='texto_facturacion']").val($(this).data('codigo_sistema')+" | "+$(this).data('fecha_vencimiento_token'));
        $('#exampleModal').modal('hide');

    });
</script>
