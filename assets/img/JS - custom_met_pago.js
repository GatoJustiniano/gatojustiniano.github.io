function sendPackage(idEvento,route){
    $("#msg-package").text('Enviando Paquetes, No actualice la pagina');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        url: route,
        type: 'post',
        dataType: 'json',
        data: {
            idEvento:idEvento,
        },
        success: function(info) {
            $.each(eval(info), function (indice, valor) {
                if (this.status == '0') {
                    toastr('error', this.respuesta);
                    $("#packetes").hide('slow');
                    $("#spin-package").hide('slow');
                } else if(this.status == '1') {

                    if (this.cantFac==0){

                        $("#msg-package").text( 'Paquete(s) enviados');
                        toastr('success', this.respuesta);
                        notifynavbar();
                        var count = 3;
                        setInterval(function(){
                            count--;
                            if (count == 0) {
                                $("#packetes").hide('slow');
                                $("#spin-package").hide('slow');
                            }
                        },1000);
                        if (window.location.pathname==="/paquetes_facturas"){
                            location.reload();
                        }
                    }else{
                        toastr('success', this.respuesta);

                        sendPackage(idEvento,route);
                    }

                }
            });

        },
        error: function(xhr, textStatus, error){
            toastr('error', 'Ops!, error inesperado en el servidor');
            console.log(xhr);
            console.log(textStatus);
            console.log(error);
        }
    });
}

function viewPdfModal(id=undefined){
    if (id){
        $("#view-pdf-modal-body-modal").html(`<iframe src="${ route('viewPdf', id)}" style="width:100%;height: 500px"></iframe>`)
    }
    $("#view-pdf-modal").modal("show");
}
$(function() {
    "use strict";
    $(function() {
        $(".preloader").fadeOut();
    });
    $(function() {
        var menues = $(".nav li");
        menues.click(function() {
            menues.removeClass("active");
            $(this).addClass("active");
            $(this).children('ul').slideToggle('slow');
        });
    });
});

var click = 0;
function click_add(){
    return click += 1;
}

//$('#contraido').click();

$(document).ready(function(){

    $("#viewPdfModal").click(function (){
       viewPdfModal($(this).attr('data-id'))
    });



    var table = $('.tabla').DataTable({
        pageLength: 25,
        responsive: true,
        language: {
            url: './assets/plugins/datatables/es_Es.json'
        },
        "order": [
            [1, 'desc']
        ],
        dom: '<"html5buttons"B>lTfgitp',

    });
    $(".tabla").attr("style", "width: 100%;");



    var tableevento = $('.tablaevento').DataTable({
        pageLength: 25,
        responsive: true,
        language: {
            url: './assets/plugins/datatables/es_Es.json'
        },
        "order": [
            [1, 'desc']
        ],
        dom: '<"html5buttons"B>lTfgitp',

    });

    $(".tablaevento").attr("style", "width: 100%;");

     var listcufd = $('.listcufd').DataTable({
        pageLength: 25,
        responsive: true,
        language: {
            url: './assets/plugins/datatables/es_Es.json'
        },
        "columnDefs": [
            {
                "targets":[4],
                "render": $.fn.dataTable.render.moment( 'DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY H:mm:ss' )
            }
        ],
        "order": [
            [4, 'desc']
        ],
        dom: '<"html5buttons"B>lTfgitp',

    });

    $(".listcufd").attr("style", "width: 100%;");

    var listfact = $('.listfact').DataTable({
        pageLength: 25,
        responsive: true,
        language: {
            url: './assets/plugins/datatables/es_Es.json'
        },
        "columnDefs": [
            {
                "targets":[0],
                "render": $.fn.dataTable.render.moment( 'YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY H:mm:ss' )
            }
        ],
        "order": [
            [0, 'desc']
        ],
        "aoColumnDefs": [{ "bVisible": false, "aTargets": [0] }],
        dom: '<"html5buttons"B>lTfgitp',

    });

    $(".listfact").attr("style", "width: 100%;");

    var listpuntoventa = $('.tablaPuntoVenta').DataTable({
        pageLength: 25,
        responsive: true,
        language: {
            url: './assets/plugins/datatables/es_Es.json'
        },
        "order": [
            [1, 'asc']
        ],
        dom: '<"html5buttons"B>lTfgitp',

    });

    $(".tablaPuntoVenta").attr("style", "width: 100%;");

    $('[data-toggle="tooltip"]').tooltip();
    $(".tooltip").tooltip("hide");

    /**
     * PUT
     * Actualizar Registros
     */
    $(document).on('click', '.btn-actualizar', function () {
        var pk = $(this).data('id');
        var table = $(this).data('tabla');
        var url = $(this).data('url');
        var retorno = $(this).data('retorno');
        var name = $(this).data('columna');
        var value = $(this).data('valor');
        var modal = $(this).data('modal');

        $(".preloader").fadeIn();
        $.get(url, {
            pk: pk,
            table: table,
            name: name,
            retorno: retorno,
            value: value
        }, function (data) {
            if (modal) {
                $('#modales').modal('hide');
            }else{
                window.location.href = retorno;
            }
        });
    });
    $(document).on('click', '.btn-actualizar-producto', function () {
        var url = $(this).data('url');
        var id = $(this).data('id');
        var value = $(this).data('valor');

        Swal.fire({
            title: "Â¿EstÃ¡ seguro?",
            text: "Â¿Desea desactivar este producto/servicio?",
            type: "info",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        }).then((result) => {

            if (result.dismiss !== "cancel") {
                // var route = $(this).data('route');
                var swa= Swal.fire({
                    title: 'Actualizando Entorno de trabajo!',
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                });
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    type: 'DELETE',
                    url:  url,
                    data: {
                        "id": id
                    },
                    success: function (data) {
                        swa.close();
                        if (data.status===1){
                            toastr("success","El producto se desactivo correctamente");
                            // est.prop('disabled', true);
                            // $("#"+id).addClass('disabled');
                            location.reload();
                        }else{
                            toastr("error","Error al desactivar el producto, intente de nuevo");
                        }
                        console.log(data)
                    },
                    error: function (jqXHR) {
                        swa.close();
                        toastr('error', 'Ops!, error inesperado en el servidor');
                    }
                })

            }else{
                console.log('cancelado');
            }

        })//end swal

    });

    //
    $('#item_ps').on('change', function(){
        var codigo = $('option:selected', this).data('codigo');
        var actividad = $('option:selected', this).data('actividad');
        $('#codigoProducto').val(codigo);
        $('#codigoActividad').val(actividad);
    })


    //CDatos Nit
    $('.select2').select2();

    var data_client = $(".data_client");
    $(data_client).find('select').change(function(e){
        e.preventDefault();
        var id = $(this).find("option:selected").data("id");
        $(".data_client select").find("option").each(function(){
            if($(this).data("id") == id){
                let id_dom = $(this).data('select');
                $(this).prop("selected","true")

                $("#select2-"+id_dom+"-container").attr('title',$(this).val());
                $("#select2-"+id_dom+"-container").text($(this).val());

            }
        })
    })

    $(document).on('change', '#numeroDocumento', function () {
        var nrs = $('option:selected', this).data('razonsocial');
        var ctdi = $('option:selected', this).data('ctdi');
        var complemento = $('option:selected', this).data('complemento');
        var codigoCliente = $('option:selected', this).data('cod');
        var nitInvalid = $('option:selected', this).data('nitinvalido');
        var verificadoSiat = $('option:selected', this).data('verificadosiat');
        var direccion = $('option:selected', this).data('direccion');

        var email = $('option:selected', this).data('email');

        $('#nitInvalido').val(nitInvalid);
        $('#verificadoSiat').val(verificadoSiat);

        $('#codigoTipoDocumentoIdentidad').val(ctdi);
        $('#complemento').val(complemento);
        $('#codigoCliente').val(codigoCliente);
        $('#email').val(email);
        $('#direccionComprador').val(direccion);
        $('#domicilioCliente').val(direccion);

        // $('#nombreRazonSocial').html('<option value="' + nrs + '">' + nrs + '</option>');
        $('#msjs').delay(5000).show().fadeOut('slow');
        $('#msjs').empty();
        $('#msjs').html('<strong>AtenciÃ³n:</strong> Si desea realizar busquedas por <strong>Nombre o RazÃ³n Social</strong>, debe limpiar <i class="ti-brush-alt text-success"></i> el formulario!');
    });

    //CDatos Clientes
    $(document).on('change', '#nombreRazonSocial', function () {
        //var nombre_rs = $('option:selected', this).val();
        var numidem = $('option:selected', this).data('numidem');
        var codigoCliente = $('option:selected', this).data('cod');
        var complemento = $('option:selected', this).data('complemento');
        var ctdi = $('option:selected', this).data('ctdi');
        var nitInvalid = $('option:selected', this).data('nitinvalido');
        var verificadoSiat = $('option:selected', this).data('verificadosiat');
        var email = $('option:selected', this).data('email');
        var direccion = $('option:selected', this).data('direccion');

        $('#email').val(email);

        $('#codigoTipoDocumentoIdentidad').val(ctdi);
        $('#complemento').val(complemento);
        $('#codigoCliente').val(codigoCliente);
        $('#nitInvalido').val(nitInvalid);
        $('#verificadoSiat').val(verificadoSiat);
        $('#direccionComprador').val(direccion);
        $('#domicilioCliente').val(direccion);
        // $('#numeroDocumento').html('<option value="' + numidem + '">' + numidem + '</option>');

        $('#msjs').delay(4000).show().fadeOut('slow');
        $('#msjs').empty();
        $('#msjs').html('Si desea realizar busquedas por en <strong>No. de NIT</strong>, debe limpiar <i class="ti-brush-alt text-success"></i> el formulario!');

    });

    //Tipo de cambio
    $(document).on('change', '#cambio_boliviano', function () {
        $('.checktdc').text('Bs');
        var cambio = $("input[id=cambio_boliviano]").val();
        sumaResultados(cambio);
        totaliza();
    });

    $(document).on('change', '#cambio_dolar', function () {
        $('.checktdc').text('USD');
        var cambio = $("input[id=cambio_dolar]").val();
        sumaResultados(cambio);
        totaliza();
    });

    $.ajaxSetup({ headers: {'csrftoken' : $('input[name=_token]').val() } });
    var $modal = $('#modales');
    $('#goDescrip').focus();

    $(document).on('keypress','#goCode', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            var $url = $('#modalProd').val();
            var actividad = $('select#actividad').val();
            $value = $('#goCode').val();

            if($value != ''){
                Swal.fire({
                    title: 'Espere!',
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                });
                $modal.load($url + '?search=' + $value + '&columna=codigoint&linea=' + click_add()+'&actividad='+actividad, function () {
                    $modal.modal({backdrop: 'static', keyboard: false});
                });
            }else{
                // toastr('error', 'Debe indicar el cÃ³digo del producto, para iniciar la busqueda!');
            }
        }
    });

    $(document).on('click','#goCode_btn', function (e) {
        e.preventDefault();
        var $url = $('#modalProd').val();
        var actividad = $('select#actividad').val();
        $value = $('#goCode').val();

        if($value != ''){
            Swal.fire({
                title: 'Espere!',
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
            });
            $modal.load($url + '?search=' + $value + '&columna=codigoint&linea=' + click_add()+'&actividad='+actividad, function () {
                $modal.modal({backdrop: 'static', keyboard: false});
                $('#goCode').val('');
            });
        }else{
            //toastr('error', 'Debe indicar el cÃ³digo del producto, para iniciar la busqueda!');
        }
    });

    //Busqueda por keypress
    $(document).on('keypress','#goDescrip', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            var $url = $('#modalProd').val();
            var actividad = $('select#actividad').val();
            var value = $('#goDescrip').val();

            if(value != ''){
                Swal.fire({
                    title: 'Espere!',
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                });
                $modal.load($url + '?search=' + value.replace(/\s+/g, '%') + '&columna=descripcion&linea=' + click_add()+'&actividad='+actividad, function () {
                    $('#goDescrip').val('');
                    $modal.modal({backdrop: 'static', keyboard: false});
                });
            }else{
                toastr('error', 'Debe indicar la descripciÃ³n del producto, para iniciar la busqueda!');
            }
        }
    });

    //Busqueda por boton
    $(document).on('click','#goDescrip_btn', function (e) {
        e.preventDefault();
        var $url = $('#modalProd').val();
        $value = $('#goDescrip').val();
        var actividad = $('select#actividad').val();
        if($value != ''){
            Swal.fire({
                title: 'Espere!',
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
            });
            $modal.load($url + '?search=' + $value.replace(/\s+/g, '%') + '&columna=descripcion&linea=' + click_add()+'&actividad='+actividad, function () {
                $modal.modal({backdrop: 'static', keyboard: false});
            });
            $('#goDescrip').empty();
        }else{
            toastr('error', 'Debe indicar la descripciÃ³n del producto, para iniciar la busqueda!');
        }
    });
    $(document).keyup(function(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            $('#modales').modal('hide');
            $("#tabla_items tbody").empty();
        }
    });
    $(document).on("click","#close-modal",function(e) {
            $('#modales').modal('hide');
            $("#tabla_items tbody").empty();
    });



    $("#btn_auth").on( "click", function() {

        var pin = $('#clave_auth').val();
        $.ajax({
            type: 'get',
            url: $('#url_valida_pin').val(),
            data:{'pin_access': pin },
            success: function (data) {
                $.each(JSON.parse(data), function (indice, valor) {
                    if (valor == '1') {
                        $('#clave_autorizacion').show('slow');
                        $('#clave_auth').val('');
                        $('#clave_auth_view').hide('slow');
                        $('#clave_autorizacion_view').show('slow');
                        $('#descuento').focus();
                    }
                    if (valor == '0') {
                        toastr('error', 'El Pin de acceso es incorrecto!');
                        $('#clave_auth').val('');
                    }
                })
            },
            error: function (jqXHR) {
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(jqXHR);
            }
        });
    });



    $("#goCuf").on( "keyup", function(e) {
        e.preventDefault();
        $('.icon-container-spinner').show();
        $.ajax({
            type: 'get',
            url: $(this).data('url'),
            data:{'num': $(this).val(), 'sucursal': $(this).data('sucursal')},
            success: function (data) {
                $('.icon-container-spinner').hide();
                $.each(JSON.parse(data), function (indice, valor) {
                    if (this.status == '0') {
                        $('#goCuf').val('')
                    }
                    if (this.status == '1') {
                        $('#goCuf').val(this.cuf[0]['cuf'])
                    }
                });
            },
            error: function (jqXHR) {
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(jqXHR);
            }
        })
    });


    $('#codigoSucursal').on('change', function(){
        let suc = $('option:selected', this).val();
        $('#goCuf').prop('disabled', false);
        $('#goCuf').attr('data-sucursal', suc);
    })


    //seleccionar checkbox
    $("#tds_check").on('click',function () {
        $("input.checkSelect:checkbox").prop('checked', $(this).prop("checked"));
    });

    //Empaquetar
    $(document).on('click','#empaquetar', function(e){
        e.preventDefault();

        let item = new Array();
        $('input.checkSelect:checkbox:checked').each(function(){
            if (this.checked) {
                item.push($(this).val())
            }
        });

        let sucursal = new Array();
        $('input.checkSelect:checkbox:checked').each(function(){
            if (this.checked) {
                sucursal.push($(this).data('sucursal'))
            }
        });

        let timeup = $(this).data('timeup');
        let maximo = $(this).data('maximo');

        $('.loaders').fadeIn('slow');

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: $('#url_post').val(),
            data:{
                item:item,
                sucursal:sucursal,
                timeup:timeup,
                maximo:maximo,
                formatJson:true
            },
            success: function (data) {
                $('.loaders').fadeOut('slow');
                $("input.checkSelect:checkbox").prop('checked', false);
                $("input.checkSelect:checkbox").prop('disabled', true);

                console.log(data);

                /*$.each(JSON.parse(data), function (indice, valor) {
                    if (this.status == '1') {
                        toastr('success', this.respuesta);
                    } else {
                        toastr('error', this.respuesta);
                    }
                });*/

            },
            error: function (jqXHR) {
                toastr('error', 'Ops!, error inesperado en el servidor');
            }
        })
    });

    //SucursalesAll
    $(document).on('change','#SucursalesAll', function(){
        $('#PuntoVentaAll').toggle("slow");
        //$('#PuntoVentaAll').show("slow");
        //$('#PuntoVentaAll-tap').hide("slow");
    });

    //store anular factura
    $(document).on('click','.btn-entrar', function(){

        const fechaFact = new Date($(this).data('femi'));
        const fechaAct = new Date();
        var vencido = false;
        if (fechaFact.getMonth()+1<fechaAct.getMonth()+1){
            if (fechaAct.getDate()>=10){
                vencido=true;
            }
        }
        if (vencido){
            toastr('error','La fecha de anulacion ha expirado')
        }else{
            $('#tabla').hide("slow");
            $('#campos').show("slow");
            var uid = $(this).data('uid');
            $('#uid').attr('value', uid);

            $('#nfact').text($(this).data('nfact'));
            $('#femi').text($(this).data('femi'));
            $('#cuf').text($(this).data('cuf'));
            $('#email').val($(this).data('email'));
        }

    });

    //anular nota de credito debito
    $(document).on('click','.btn-entrar-ncd', function(){
        $('#tabla_ncd').hide("slow");
        $('#campos_ncd').show("slow");
        var uid = $(this).data('uid');
        $('#uid_ncd').attr('value', uid);
        $('#nfact_ncd').text($(this).data('nfact'));
        $('#femi_ncd').text($(this).data('femi'));
        $('#cuf_ncd').text($(this).data('cuf'));
    });

    $(document).on('click','.btn-regresar-ncd', function(){
        $('#tabla_ncd').show("slow");
        $('#campos_ncd').hide("slow");
        $('#uid_ncd').val('');
        $('#nfact_ncd').text('');
        $('#femi_ncd').text('');
        $('#cuf_ncd').text('');
    });

    $(document).on('click','.btn-regresar', function(){
        $('#tabla').show("slow");
        $('#campos').hide("slow");
        $('#uid').val('');
        $('#nfact').text('');
        $('#femi').text('');
        $('#cuf').text('');
    });

    //anular nota de conciliacion
    $(document).on('click','.btn-entrar-con', function(){
        $('#tabla_con').hide("slow");
        $('#campos_con').show("slow");
        var uid = $(this).data('uid');
        $('#uid_con').attr('value', uid);
        $('#nfact_con').text($(this).data('nfact'));
        $('#femi_con').text($(this).data('femi'));
        $('#cuf_con').text($(this).data('cuf'));
    });

    $(document).on('click','.btn-regresar-con', function(){
        $('#tabla_con').show("slow");
        $('#campos_con').hide("slow");
        $('#uid_con').val('');
        $('#nfact_con').text('');
        $('#femi_con').text('');
        $('#cuf_con').text('');
    });

    $(document).on('click','.btn-regresar-con', function(){
        $('#tabla').show("slow");
        $('#campos').hide("slow");
        $('#uid').val('');
        $('#nfact').text('');
        $('#femi').text('');
        $('#cuf').text('');
    });

    //Procesa la anulaciÃ³n factura
    $(document).on('click','#btn-anulacion', function(){

        Swal.fire({
            title: "Â¿EstÃ¡ seguro?",
            text: "Â¿Desea anular este documento?",
            type: "info",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                var motivo = $('option:selected','#codigoMotivo').val();
                var uid = $('#uid').val();
                var email = $('#uid').val();
                var route = $(this).data('route');
                var sweet= Swal.fire({
                    title: 'Anulando Factura!',
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                });
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: route,
                    data:{
                        codigoMotivo:motivo,
                        id:uid
                    },
                    success: function (data) {

                        sweet.close();

                        switch (data.status){
                            case 10:
                                $("#button-anulacion-"+uid).prop('disabled',true);
                                $("#statusfact-"+uid).removeClass('text-success');
                                $("#statusfact-"+uid).addClass('text-danger');
                                $("#statusfact-"+uid).text('Anulada');

                                $('#tabla').show("slow");
                                $('#campos').hide("slow");
                                $('#nfact').text('');
                                $('#femi').text('');
                                $('#cuf').text('');

                                toastr(data.icon,data.message);
                                break;
                            case 0:
                                toastr(data.icon,data.message);
                                break;
                            case 1:
                                data.message.map(x=>{
                                    toastr(data.icon,x.descripcion);
                                })
                                break;
                        }
                    },
                    error: function (jqXHR) {
                        sweet.close();
                        console.log(jqXHR)
                        toastr('error', 'Ops!, error inesperado en el servidor');
                    }
                })

            }else{}

        })//end swal

    });




    /*Generate CUFD independiente*/
    $(document).on('click','#generate-cufd-instant', function(){
        var route = $(this).data('route');
        var cpv = $(this).data('cpv');
        var csuc = $(this).data('suc');
        var tipo = $(this).data('tipo');
        generateCufd(route, cpv, csuc, tipo);
    });


    /*Generate CUFD*/
    $(document).on('click','#generate-cufd', function(){
        var route = $(this).data('route');
        var cpv = $("#codigoPuntoVenta").val();
        var csuc = $("#codigoSucursal").val();
        var tipo = $("#tipo").val();
        generateCufd(route, cpv, csuc, tipo);
    });

    /*Registrar evento significativo*/
    $(document).on('click','#regEventSig', function(){
        var route = $(this).data('route');
        console.log(route)
        var motivo = $('option:selected','#codigoMotivoEvento').val();
        // var cufdEvento = $('option:selected','#cufdEvento').val();
        var cufdEvento = $('#cufdEventoprue').val();
        var punto = $("#codigoPuntoVenta").val();
        var sucursal = $("#codigoSucursal").val();
        var descripcion = $('#descripcion').val();
        var inicio = $('#fechaHoraInicioEvento').val();
        var fin = $('#fechaHoraFinEvento').val();

        var idEvento = $('#evenSigDB').val();
        //
        // Swal.fire({
        //     title: 'Â¡AtenciÃ³n!',
        //     text: 'En proceso de registro del Evento Significativo, por favor espere...',
        //     onBeforeOpen: () => {
        //         Swal.showLoading()
        //     },
        //     allowOutsideClick: false
        // })
        //
        // $.ajaxSetup({
        //     headers: {
        //       'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        //     }
        // });
        //
        // $.ajax({
        //     url: route,
        //     type: 'post',
        //     dataType: 'json',
        //     data: {
        //         codigoMotivoEvento: motivo,
        //         cufdEvento: cufdEvento,
        //         codigoPuntoVenta: punto,
        //         codigoSucursal: sucursal,
        //         descripcion: descripcion,
        //         fechaHoraInicioEvento: inicio,
        //         fechaHoraFinEvento: fin,
        //         ideventosign: idEvento,
        //         manual:true
        //     },
        //     success: function(info) {
        //         Swal.close();
        //         $.each(eval(info), function (indice, valor) {
        //             if (this.status == '0') {
        //                 toastr('error', this.respuesta);
        //             } else if(this.status == '1') {
        //                 toastr('success', this.respuesta);
        //                 $('#mess').show();
        //                 $('.message').text(this.codigo);
        //                 $('.message').val(this.codigo);
        //                 $('#btn-evs').prop("disabled",false);
        //             }
        //         });
        //     }
        // });
    });

    /*Cerrar evento significativo*/
    $(document).on('click','.closeEvent', function(){
        var route = $(this).attr('route');
        var routedelete = $(this).attr('routedelete');
        var routeemisoronline = $(this).attr('routeonline');
        var eventId = $(this).attr('eventId');

        Swal.fire({
            title: 'Desea cerrar el evento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Cerrarlo!'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                var sweet= Swal.fire({
                    title: 'Â¡AtenciÃ³n!',
                    html: 'En proceso cerrando evento',
                    // timer: 2000,
                    timerProgressBar: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                });
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });

                $.ajax({
                    url: route,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        IdEvento: eventId,
                    },
                    success: function(info) {
                        console.log(info)
                        sweet.close();
                        if (info.meta.code===200){
                            notifynavbar(sucursalnavbar,puntoventanavbar);
                            Swal.fire(
                                'Cerrado!',
                                'El evento se cerrÃ³ y se registro en la base de datos del SIAT.',
                                'success'
                            ).then(() => {
                                window.location.href=routeemisoronline;
                            });
                        }else if (info.status===0){
                            Swal.fire({
                                title: 'Desea eliminar el evento?',
                                text: "El evento no cuenta con ninguna factura offline, desea eliminarlo en el SIFAC?",
                                icon: 'error',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Si, Eliminalo!'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteEvento(eventId,routedelete,routeemisoronline)
                                }
                            });
                        }else if(info.status===1){
                            editEvento(info,routeupdateevent,routeemisoronline);
                        }else{
                                Swal.fire(
                                    'Ops!',
                                    info.errors.details,
                                    'error'
                                )
                            }
                        },
                    error: function(xhr){
                        console.log(xhr);

                        sweet.close();
                        Swal.fire(
                            'Fallo!',
                            xhr.responseJSON.errors.details,
                            'error'
                        );
                    }
                });

            }
        });
    })
    function editEvento(info,routeupdateevent,routeemisoronline, errors=false){
        var motivo=``;
        info.motivo.map(x=>{
            motivo=motivo+ `<option value="${x.codigoClasificador}">${x.descripcion}</option>`
        });
        var err=``;
        var icon='warning'
        if (errors){
            err=` <div class="alert alert-danger" role="alert">
                ${errors}
            </div>`;
            icon="error";

        }
        Swal.fire({
            title: 'Debe completar algunos campos',
            icon:icon,
            html: `
                                ${err}
                                <form>
                                  <div class="form-group">
                                    <label for="formGroupExampleInput">Motivo Evento</label>
                                    <select id="codigoMotivoEvento" name="codigoMotivoEvento" class="form-control" required>
                                        ${motivo}
                                    </select>
                                  </div>
                                  <div class="form-group">
                                    <label for="formGroupExampleInput2">Descripcion</label>
                                    <textarea class="form-control" id="descripcion" placeholder="INACCESIBILIDAD DE INTERNET"></textarea>
                                  </div>
                                </form>
                                `,
            focusConfirm: false,
            confirmButtonText: 'Actualizar',
            width: '650px',
            preConfirm: () => {
                updateEvento(
                    routeupdateevent,
                    routeemisoronline,
                    {
                        codigoMotivoEvento: document.getElementById('codigoMotivoEvento').value,
                        descripcion: document.getElementById('descripcion').value,
                        info: info
                    }
                )
            }
        });

    }
    /*ACTUALIZAR EVENTO*/
    function updateEvento(route,routeemisoronline,datas){
        let timerInterval
        var sweet= Swal.fire({
            title: 'Â¡AtenciÃ³n!',
            html: 'En proceso cerrando evento',
            timerProgressBar: false,
            didOpen: () => {
                Swal.showLoading()
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        });
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: route+"/"+datas.info.evento.id,
            type: 'put',
            dataType: 'json',
            data: {
                codigoMotivoEvento:datas.codigoMotivoEvento,
                descripcion:datas.descripcion,
            },
            success: function(info) {
                Swal.close();
                Swal.fire(
                    'Cerrado!',
                    'El evento se cerrÃ³ y se registro en la base de datos del SIAT.',
                    'success'
                ).then(() => {
                    window.location.href=routeemisoronline;
                });

            },
            error: function(xhr){
                Swal.close();
                console.log(xhr)
                editEvento(datas.info,route,routeemisoronline,errors=xhr.responseJSON.errors.details)
            }
        });
    }
    /*Eliminar evento */
    function deleteEvento(id,route,routeonline){
        let timerInterval
        var sweet= Swal.fire({
            title: 'Â¡AtenciÃ³n!',
            html: 'En proceso eliminando evento',
            // timer: 2000,
            timerProgressBar: false,
            didOpen: () => {
                Swal.showLoading()
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        });
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            url: route+"/"+id,
            type: 'DELETE',
            success: function(info) {
                // notifynavbar(sucursalnavbar,puntoventanavbar);
                sweet.close();
                Swal.fire(
                    'Eliminado!',
                    'El evento se eliminÃ³ de SIFAC.',
                    'success'
                ).then(() => {
                    window.location.href=routeonline;
                });
            },
            error: function(xhr){
                console.log(xhr);
                toastr('error', 'Ops!, error inesperado en el servidor');
            }
        });
    }
    $(document).on('click','#sendPackage', function(){

        var idEvento = $(this).attr('idEvento');
        var route = $(this).data('route');


        Swal.fire({
            title: 'Desea enviar el paquete?',
            text: "Se enviarÃ¡ el paquete a SIAT",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Enviarlo!'
        }).then((result) => {
            if (result.isConfirmed) {
                sendPackage(idEvento,route);
            }
        });




    });
    //Importar facturas masivas
    /*Envio de paquetes de facturas*/
    var fileForm;
    var urlFile;
    var inputFile;
    var dataForm;
    $(function(){
        fileForm = $('#sendFacturaMasiva');
        inputFile = $('#files');

        urlFile = fileForm.attr('action');
        inputFile.on('change', function(){

            dataForm = new FormData();
            dataForm.append('file', inputFile[0].files[0]);

            $.ajax({
                url:urlFile +'?'+fileForm.serialize(),
                method:'POST',
                data:dataForm,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    Swal.fire({
                        title: 'Â¡Bien!!',
                        text: 'En proceso carga de documentos, por favor espere!',
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },allowOutsideClick: false
                    })
                }
            })
                .done(function(data){
                    Swal.close();
                    $.each(eval(data), function (indice, valor) {
                        if (this.status == '0') {
                            toastr('error', this.respuesta);
                        } else if(this.status == '1') {
                            $('#btn-carga').prop("disabled", false);
                            $('#btn-carga').click();

                            $('#desc_archivo').text(this.mensaje);
                            toastr('success', this.respuesta);
                        }
                    });
                })
                .fail(function(){
                    toastr('error', 'hubo un error');
                })
        })

    })

    $("#inicioMasiva").on('click', function() {
        var route = $(this).data('route');
        var cds = $('.codigoDocumentoSector_mas').val();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: route,
            data: {
                codigoDocumentoSector:cds,
                type:'json'
            },
            dataType: "json",
            beforeSend: function () {
                Swal.fire({
                    title: 'Â¡Bien!!',
                    text: 'En proceso generaciÃ³n de la primera corrida, por favor espere!',
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    },allowOutsideClick: false
                })
            },
            success: function(info) {
                console.log(info)
                Swal.close();
                $.each(eval(info), function (indice, valor) {
                    if (this.status == '0') {
                        toastr('error', this.respuesta);
                    } else if(this.status == '1') {
                        $('#btn-primera').prop("disabled", false);
                        $('#btn-primera').click();
                        $('#inicioMasiva').prop("disabled", true);
                        $('#cantidad').val(this.cantidad);

                        toastr('success', this.respuesta);
                    }
                });
            },
            error: function(error) {
                Swal.close();
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
            }
        });

    })

    /*Envio de paquetes de facturas masivas*/
    $(document).on('click','#sendPackageMasive', function(){
        /*var cantidad = $('#cantidad').val();*/
        var punto = $('.codigoPuntoVenta_mas').val();
        var sucursal = $('.codigoSucursal_mas').val();
        var cds = $('.codigoDocumentoSector_mas').val();
        var tipoFactura = $('.tipoFactura_mas').val();
        var timeup = $('#timeup').val();
        var maximo = $('#maximo').val();
        var route = $(this).data('route');
        var retorna = $(this).data('return');

        Swal.fire({
            title: 'Â¡AtenciÃ³n!',
            text: 'En proceso envÃ­o de facturas masivas, esto puede demorar algunos minutos por favor espere!',
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            allowOutsideClick: false
        })

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            url: route,
            type: 'post',
            dataType: 'json',
            data: {
                codigoPuntoVenta:punto,
                codigoSucursal:sucursal,
                tipoFactura:tipoFactura,
                codigoDocumentoSector:cds,
                timeup:timeup,
                maximo:maximo,
                formatJson: 0
            },
            success: function(info) {
                Swal.close();
                console.log(info);
                $.each(eval(info), function (indice, valor) {
                    if (this.status == '0') {
                        toastr('error', this.respuesta);
                    } else if(this.status == '1') {
                        toastr('success', this.respuesta);
                        var count = 3;
                        setInterval(function(){
                            count--;
                            if (count == 0) {
                                location.href = retorna;
                            }
                        },1000);
                    }
                });

            }
        });

    });

    //Envio nota de credito debito
    $("#sendFacturaMasivaXXX").on('submit', function(e) {
        e.preventDefault();
        var datosForm = $('#sendFacturaMasiva');
        var route = datosForm.attr('action');
        var datos = datosForm.serialize();
        var files = $('#files');

        var formDatas = new FormData(datosForm[0]);
        formDatas.append('file', files[0].files[0]);

        $.ajax({
            url:route  + '?' + datos,
            method:'POST',
            data:formDatas,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                Swal.fire({
                    title: 'Â¡Bien!!',
                    text: 'En proceso envÃ­o de facturas masivas, por favor espere!',
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    },allowOutsideClick: false
                })
            }
        })
            .done(function(info){
                Swal.close();
                $.each(eval(info), function (indice, valor) {
                    if (this.status == '0') {
                        toastr('error', this.respuesta);
                    } else if(this.status == '1') {
                        toastr('success', this.respuesta);
                    }
                });

            })
            .fail(function(){
                toastr('error', 'hubo un error');
            })
    })

    $(document).on('click','#detalleOriginal', function(){
        $('#detalleOriginalTable').toggle("slow");
    });

    //Envio de facturas ajax
    $("#sendFacturas").on('submit', function(e) {
        e.preventDefault();
        var datos = $("#sendFacturas").serialize();
        var route = $(this).data('route');
        var retorno = $(this).data('retorno');

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: route,
            data: datos,
            dataType: "json",
            beforeSend: function () {
                Swal.fire({
                    title: 'Â¡Bien!!',
                    text: "Emitiendo Factura Fiscal por favor espere!",
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    },allowOutsideClick: false
                })
            },
            success: function(info) {
                Swal.close();
                //console.log(info)
                $.each(eval(info), function (indice, valor) {
                    if (this.status == '0') {
                        toastr('error', this.respuesta);
                    } else if(this.status == '1') {
                        toastr('success', this.respuesta);
                        returnPage(retorno);
                    }
                });
            },
            error: function(error) {
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
            }
        });

    });

    $("#conf_masiva").on( "click", function() {
        $(this).toggleClass('off');
        if($(this).is(".off")){
            $('#confMasiva').show("slow");
            $('#infoMasiva').hide("slow");
        }else {
            $('#infoMasiva').show("slow");
            $('#confMasiva').hide("slow");
        }
    });

    $('#saveConfig').on("click", function(){
        var cpv = $("option:selected","#cpv").val();
        var suc = $("option:selected","#suc").val();
        var cds = $("option:selected","#cds").val();
        var tf = $("option:selected","#tf").val();
        var cmp = $("option:selected","#cmp").val();
        var tc = $("option:selected","#tc").val();
        var ume = $("option:selected","#ume").val();

        $('.codigoPuntoVenta_mas').val(cpv);
        $('.codigoSucursal_mas').val(suc);
        $('.codigoDocumentoSector_mas').val(cds);
        $('.tipoFactura_mas').val(tf);
        $('.tipoCambio_mas').val(tc);
        $('.codigoMetodoPago_mas').val(cmp);
        $('.unidadMedida_mas').val(ume);

        toastr('success', 'ConfiguraciÃ³n de facturaciÃ³n masiva guadada!');
        $('#continuar').click();

        $('#alertMasiva').hide();
        $('#csvMasiva').show();

        /*if(cds == 15){
            $('#csvMasiva').remove();
        }*/

        var data = {cpv:cpv, suc:suc, cds:cds, tf:tf, cmp:cmp, tc:tc, ume:ume};
        localStorage.setItem('config', JSON.stringify(data));
    })

    $(function(){
        if(localStorage.getItem('config')){
            var datos = JSON.parse(localStorage.getItem('config'));
            $('.codigoPuntoVenta_mas').val(datos.cpv);
            $('.codigoSucursal_mas').val(datos.suc);
            $('.codigoDocumentoSector_mas').val(datos.cds);
            $('.tipoFactura_mas').val(datos.tf);
            $('.tipoCambio_mas').val(datos.tc);
            $('.codigoMetodoPago_mas').val(datos.cmp);
            $('.unidadMedida_mas').val(datos.ume);

            //seleccionados
            /*$('#cpv > option[value="'+datos.cpv+'"]').attr('selected', 'selected');
            $('#suc > option[value="'+datos.suc+'"]').attr('selected', 'selected');*/
            $('#cds > option[value="'+datos.cds+'"]').attr('selected', 'selected');
            $('#tf > option[value="'+datos.tf+'"]').attr('selected', 'selected');
            $('#tc > option[value="'+datos.tc+'"]').attr('selected', 'selected');
            $('#cmp > option[value="'+datos.cmp+'"]').attr('selected', 'selected');
            $('#ume > option[value="'+datos.ume+'"]').attr('selected', 'selected');

            /*if(datos.cds == 15){
                $('#csvMasiva').remove();
            }*/

        }else{
            $('#alertMasiva').show();
            $('#csvMasiva').hide();
        }

    })

    //Reportes

    $(document).on('click', ".report", function() {
        let target = $(this).data('target');
        $('#'+target).show("fast");
        $('#'+target+' .close-report').attr("data-target",target);
        $('#hide').hide("slow");
        $('#custom-reports').hide("slow");
    })

    $(document).on('click', ".close-report", function() {
        let target = $(this).attr("data-target");
        $('#hide').show("fast");
        $('#custom-reports').show("fast");
        $('#'+target).hide("slow");
    });

    $(document).on('click', ".pdf", function() {
        let domp = $(this).data('dom');
        let tipop = $(this).data('tipo');
        let dom = domp+tipop;

        var route = $(this).data('route');
        var title = $("#"+domp+" #title_").val();
        var subtitle = $("#"+domp+" #subtitle_").val();
        var tipo = $("#"+dom+" #tipo2").val();
        var actividad = $("#"+dom+" #actividad2").val();
        var inicioFecha = $("#"+dom+" #inicioFecha").val();
        var finFecha = $("#"+dom+" #finFecha").val();
        var codigoPuntoVenta = $("#"+dom+" #codigoPuntoVenta2").val();
        var codigoSucursal = $("#"+dom+" #codigoSucursal2").val();

        //PETRES
        var cliente = $("#"+dom+" #LVcliente2").val();
        var contrato = $("#"+dom+" #LVcontrato2").val();
        var numItem = $("#"+dom+" #LVnumItem2").val();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: route,
            data: {
                title: title,
                subtitle: subtitle,
                tipo: tipo,
                actividad: actividad,
                codigoPuntoVenta:codigoPuntoVenta,
                codigoSucursal:codigoSucursal,
                inicioFecha: inicioFecha,
                finFecha: finFecha,

                cliente: cliente,
                contrato: contrato,
                numItem: numItem
            },
            xhrFields: {
                responseType: 'blob'
            },
            beforeSend: function () {
                $('.loaders').fadeIn('slow');
            },
            success: function(response) {
                $('.loaders').fadeOut('slow');
                var blob = new Blob([response]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = title + "_.pdf";
                link.click();
            },
            error: function(error) {
                $('.loaders').fadeOut('slow');
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
            }
        });
    })

    $(document).on('click', ".excel", function() {
        let domp = $(this).data('dom');
        let tipop = $(this).data('tipo');
        let dom = domp+tipop;

        var route = $(this).data('routexel');
        var title = $("#"+domp+" #title_").val();
        var subtitle = $("#"+domp+" #subtitle_").val();

        var tipo = $("#"+dom+" #tipo2").val();
        var actividad = $("#"+dom+" #actividad2").val();
        var inicioFecha = $("#"+dom+" #inicioFecha").val();
        var finFecha = $("#"+dom+" #finFecha").val();
        var codigoPuntoVenta = $("#"+dom+" #codigoPuntoVenta2").val();
        var codigoSucursal = $("#"+dom+" #codigoSucursal2").val();

        //PETRES
        var cliente = $("#"+dom+" #LVcliente2").val();
        var contrato = $("#"+dom+" #LVcontrato2").val();
        var numItem = $("#"+dom+" #LVnumItem2").val();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: route,
            data: {
                title: title,
                subtitle: subtitle,
                tipo: tipo,
                actividad: actividad,
                codigoPuntoVenta:codigoPuntoVenta,
                codigoSucursal:codigoSucursal,
                inicioFecha: inicioFecha,
                finFecha: finFecha,

                cliente:cliente,
                contrato:contrato,
                numItem:numItem
            },
            xhrFields: {
                responseType: 'blob'
            },
            beforeSend: function () {
                $('.loaders').fadeIn('slow');
            },
            success: function(result, status, xhr) {
                $('.loaders').fadeOut('slow');
                var disposition = xhr.getResponseHeader('content-disposition');
                var matches = /"([^"]*)"/.exec(disposition);
                var filename = (matches != null && matches[1] ? matches[1] : title + '_.xlsx');

                var blob = new Blob([result], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            error: function(error) {
                $('.loaders').fadeOut('slow');
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
            }
        });
    })

    $(document).on('click', ".Periodopdf", function() {
        let domp = $(this).data('dom');
        let tipop = $(this).data('tipo');
        let dom = domp+tipop;

        let fechasArray  =  $("#"+dom+" #periodoReportes").val().split("-"); /// [0] es el inicio, [1] es el fin
        let anio  =  $("#"+dom+" #anioReportes").val();
        var route = $(this).data('route');
        var title = $("#"+domp+" #title_").val();
        var subtitle = $("#"+domp+" #subtitle_").val();
        var tipo = $("#"+dom+" #tipo").val();
        var actividad = $("#"+dom+" #actividad").val();
        var inicioFecha = fechasArray[0]+anio;
        var finFecha = fechasArray[1]+anio;
        var codigoPuntoVenta = $('#'+dom+' #codigoPuntoVenta').val();
        var codigoSucursal = $('#'+dom+' #codigoSucursal').val();

        //PETRES
        var cliente = $("#"+dom+" #LVcliente").val();
        var contrato = $("#"+dom+" #LVcontrato").val();
        var numItem = $("#"+dom+" #LVnumItem").val();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: route,
            data: {
                title: title,
                subtitle: subtitle,
                tipo: tipo,
                actividad: actividad,
                codigoPuntoVenta: codigoPuntoVenta,
                codigoSucursal: codigoSucursal,
                inicioFecha: inicioFecha,
                finFecha: finFecha,

                cliente:cliente,
                contrato:contrato,
                numItem:numItem
            },
            xhrFields: {
                responseType: 'blob'
            },
            beforeSend: function () {
                $('.loaders').fadeIn('slow');
            },
            success: function(response) {
                $('.loaders').fadeOut('slow');
                var blob = new Blob([response]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = title + "_.pdf";
                link.click();
            },
            error: function(error) {
                $('.loaders').fadeOut('slow');
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
            }
        });
    })

    $(document).on('click', ".Periodoexcel", function() {
        let domp = $(this).data('dom');
        let tipop = $(this).data('tipo');
        let dom = domp+tipop;

        let fechasArray  =  $("#"+dom+" #periodoReportes").val().split('-'); /// [0] es el inicio, [1] es el fin
        let anio  =  $("#"+dom+" #anioReportes").val();

        var route = $(this).data('routexel');
        var title = $("#"+domp+" #title_").val();
        var subtitle = $("#"+domp+" #subtitle_").val();
        var tipo = $("#"+dom+" #tipo").val();
        var actividad = $("#"+dom+" #actividad").val();
        var inicioFecha = fechasArray[0]+anio;
        var finFecha = fechasArray[1]+anio;
        var codigoPuntoVenta = $("#"+dom+" #codigoPuntoVenta").val();
        var codigoSucursal = $("#"+dom+" #codigoSucursal").val();

        //PETRES
        var cliente = $("#"+dom+" #LVcliente").val();
        var contrato = $("#"+dom+" #LVcontrato").val();
        var numItem = $("#"+dom+" #LVnumItem").val();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: route,
            data: {
                title: title,
                subtitle: subtitle,
                tipo: tipo,
                actividad: actividad,
                codigoPuntoVenta: codigoPuntoVenta,
                codigoSucursal: codigoSucursal,
                inicioFecha: inicioFecha,
                finFecha: finFecha,

                cliente:cliente,
                contrato:contrato,
                numItem:numItem
            },
            xhrFields: {
                responseType: 'blob'
            },
            beforeSend: function () {
                $('.loaders').fadeIn('slow');
            },
            success: function(result, status, xhr) {
                $('.loaders').fadeOut('slow');
                var disposition = xhr.getResponseHeader('content-disposition');
                var matches = /"([^"]*)"/.exec(disposition);
                var filename = (matches != null && matches[1] ? matches[1] : title + '_.xlsx');

                var blob = new Blob([result], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            error: function(error) {
                $('.loaders').fadeOut('slow');
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
                console.log("aqio");
            }
        });
    })


    //Oficina virtual
    $("#oficinaVirtual").on('submit', function(e) {
        e.preventDefault();
        var datosForm = $('#oficinaVirtual');
        var route = datosForm.attr('action');
        var datos = datosForm.serialize();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        // $('.loaders').fadeIn('slow');
        var swa= Swal.fire({
            title: 'Enviando factura!',
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        });
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: route,
            data: datos,
            success: function (data) {
                swa.close();
                if (data[0].status == '0') {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: data[0].respuesta,
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else if(data[0].status == '1') {
                    $('#next-uno').click();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: data[0].respuesta,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    // toastr('success', );
                }


            },
            error: function (jqXHR) {
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(jqXHR)
            }
        })

    })

    //Generar CUIS
    $("#genCuis").on('submit', function(e) {
        e.preventDefault();
        var datosForm = $('#genCuis');
        var route = datosForm.attr('action');
        var datos = datosForm.serialize();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        // $('.loaders').fadeIn('slow');
        var swa= Swal.fire({
            title: 'Generando C.U.I.S, por favor espere!',
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        });
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: route,
            data: datos,
            success: function (data) {
                swa.close();

                if (data[0].status == '0') {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: data[0].respuesta,
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else if(data[0].status == '1') {
                    $('#next-dos').click();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: data[0].respuesta,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    // toastr('success', );
                }
            },
            error: function (jqXHR) {
                swa.close();
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(jqXHR)
            }
        })
    })

    //Sincronizacion de catalogos
    $(document).on('click', '#sincronizado', function () {
        var sucursal = $('option:selected', '#codigoSucursal').val();
        var puntoVenta = $('option:selected', '#codigoPuntoVenta').val();

        if($('#mode').val() == "inicio"){
            var valor = $.map($('.valores'), function (e, i) {
                if (!isNaN(+e.value)) {
                    return +e.value;
                }
            });
        }else if($('#mode').val() == "normal"){
            var valor = $.map($('input:checkbox:checked'), function (e, i) {
                if (!isNaN(+e.value)) {
                    return +e.value;
                }
            });
        }

        if ($('#codigoPuntoVenta').val().trim() === '') {
            toastr('error','Debe seleccionar un Punto de Venta');
        } else if($('#codigoSucursal').val().trim() === ''){
            toastr('error','Debe seleccionar una Sucursal');
        }else{
            if (valor.length === 0) {
                toastr('error','Debe seleccionar al menos un item del catÃ¡logo');
            }else{
                //Contenido
                var swa= Swal.fire({
                    title: 'Â¡AtenciÃ³n!',
                    text: 'En curso proceso de sincronizaciÃ³n con Impuestos Nacionales, no abandone, no recargue o cierre la pÃ¡gina actual!',
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                });

                $.ajaxSetup({
                    headers: { 'X-CSRF-TOKEN': xcsrf },
                    url: route('sincron-total'),
                    data: {
                        valor: valor,
                        puntoVenta: puntoVenta,
                        sucursal: sucursal
                    },
                    success: function(info) {
                        swa.close();
                        $.each(JSON.parse(info), function (indice, valor) {
                            if (this.status == '0') {
                                toastr('error', this.respuesta);
                                //console.log(this.respuesta);
                            } else if(this.status == '1') {
                                toastr('success', this.respuesta);
                                if($('#mode').val() == "inicio"){
                                    $('#next-tres').click();
                                }
                            } else if(this.status == '2') {
                                toastr('info', this.respuesta);
                                //console.log(this.respuesta);
                            }
                        });
                    },
                    error: function (jqXHR) {
                        swa.close();
                        toastr('error', 'Ops!, error inesperado en el servidor');
                        console.log(jqXHR);
                    }
                });
                $.ajax();
            }
        }
    });





    //Agregar Clientes nuevos
    $(document).on('click', '#agregar_clientes', function () {
        var url = $(this).data('route');
        $modal.load(url, function () {
            $modal.modal();
        });
    });


    //Agregar nuevo cliente
    $(document).on('click', "#sendNewClient", function() {

        var route = $(this).data('route');
        var retorna = $(this).data('retorna');

        var codigo = $("#codigo").val();
        var tipo = $("#tipo").val();
        var numidem = $("#numidem").val();
        var complem = $("#complementos").val();
        var nombres_rs = $("#nombres_rs").val();
        var domicilio = $("#domicilio").val();
        var email = $("#emails").val();
        var telefono = $("#telefono").val();
        var cel1 = $("#cel1").val();
        var cel2 = $("#cel2").val();
        var departamento = $("#departamento").val();
        var modo = $("#modo").val();
        var nitInvalido = $("#nitInvalido").val();

        var swa = Swal.fire({
            title: 'Â¡AtenciÃ³n!',
            text: 'Creando Cliente',
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        });

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            type: "POST",
            url: route,
            data: {
                codigo: codigo,
                tipo: tipo,
                numidem: numidem,
                complemento: complem,
                nombre_rs: nombres_rs,
                domicilio: domicilio,
                email: email,
                telefono: telefono,
                cel1: cel1,
                cel2: cel2,
                departamento: departamento,
                nitInvalido: nitInvalido,
                modo: modo
            },
            dataType: "json",

            success: function(data) {
                swa.close();
                    nombres_rs = nombres_rs.toUpperCase();
                if (data.status=="1"){
                    let htmlnum = `<option value="${ numidem }" data-razonsocial="${nombres_rs}" data-ctdi="${tipo}" data-complemento="${complem}" data-cod="${codigo}" data-email="${email}" data-nitinvalido="${nitInvalido}" selected>${ numidem }</option>`
                    let htmlraz = `<option value="${nombres_rs}" data-nitinvalido="${nitInvalido}" data-numidem="${ numidem }" data-cod="${codigo}" data-complemento="${complem}" data-ctdi="${tipo}" data-email="${email}" selected>${nombres_rs}</option>`;
                    $("#numeroDocumento").append(htmlnum);
                    $("#nombreRazonSocial").append(htmlraz);


                    $('#nitInvalido').val(nitInvalido);

                    $('#codigoTipoDocumentoIdentidad').val(tipo);
                    $('#complemento').val(complem);
                    $('#codigoCliente').val(codigo);
                    $('#email').val(email);

                    toastr("success",data.respuesta);
                    $('#modales').modal('hide');
                    // location.reload();
                }else if(data.status=="2"){
                    $("#numidem").addClass("is-invalid")
                    Swal.fire({
                        title: data.respuesta,
                        text: "El NIT no se encuentra registrado en la Base de Datos del SIN. Desea guardar de todos modos?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, Guardalo!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $("#nitInvalido").val(1);
                            $("#sendNewClient").click()
                        }
                    })
                    // toastr("error",data.respuesta)
                }else{
                    toastr("error",data.respuesta)
                }


            },
            error: function(error) {
                swa.close();
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
            }
        });
    });


    $(document).on('click', ".delete-space", function() {
        var id = $(this).data('id');
        var est = $(this);
        Swal.fire({
            title: "Â¿EstÃ¡ seguro?",
            text: "Â¿Desea desactivar este espacio de trabajo?",
            type: "info",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        }).then((result) => {

            if (result.dismiss !== "cancel") {
                // var route = $(this).data('route');
                var swa= Swal.fire({
                    title: 'Actualizando Entorno de trabajo!',
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                });
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    type: 'DELETE',
                    url:  route('delete-configsis', id),
                    data: {
                        "id": id
                    },
                    success: function (data) {
                        swa.close();
                        if (data.status===1){
                            toastr("success","El entorno se desactivo correctamente");
                            est.prop('disabled', true);
                            $("#"+id).addClass('disabled');
                        }else{
                            toastr("error","Error al desactivar el entorno, intente de nuevo");
                        }
                        console.log(data)
                    },
                    error: function (jqXHR) {
                        swa.close();
                        toastr('error', 'Ops!, error inesperado en el servidor');
                    }
                })

            }else{
                console.log('cancelado');
            }

        })//end swal

    })


    /*conectar y desconectar del Siat 29/10/2021*/
    /*funcion online y offline sifac */
    $(document).on('click','#closeSiat', function(){
        $("#off-siat").show();
        $("#on-siat").hide();
        var route = $(this).data("url");
        localStorage.setItem('openOff', 0);

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: route,
            type: 'post',
            dataType: 'json',
            data: { status: 0 },
            success: function(data) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Sifac Desconectado',
                    showConfirmButton: false,
                    timer: 1500
                })
            },
            error: function(error) {
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
            }
        });

    })

    $(document).on('click','#openSiat', function(){
        $("#off-siat").hide();
        $("#on-siat").show();
        localStorage.setItem('openOff', 1);

        var route = $(this).data("url");
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: route,
            type: 'post',
            dataType: 'json',
            data: { status: 1 },
            success: function(data) {
                console.log(route)
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Sifac Conectado',
                    showConfirmButton: false,
                    timer: 1500
                })
            },
            error: function(error) {
                toastr('error', 'Ops!, error inesperado en el servidor');
                console.log(error);
            }
        });
    })
    /*fin conectar y desconectar del Siat 29/10/2021*/

})

function extra(){
    //Sectoes economicos
    var sector = $('#_codigoSector').val();
    if(sector == 1){
        return '';
    }else if(sector == 6){
        return '<button class="btn btn-primary btn-sm show-huesped" type="button" title="Lista de huÃ©spedes" style="margin-left: 5px;"><i class="ti-user"></i></button>';
    }else{
        return '';
    }
}

/**
 * Genera CUFD
 * @ vars: none
 */
function generateCufd(route, cpv, csuc, tipo){

    var swa = Swal.fire({
        title: 'Â¡AtenciÃ³n!',
        text: 'En proceso generaciÃ³n de nuevo C.U.F.D, por favor espere un momento...',
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        },
    });

    $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        url: route,
        type: 'post',
        dataType: 'json',
        data: {
            tipo: tipo,
            codigoPuntoVenta: cpv,
            codigoSucursal: csuc,
            auto:true,
            manual:true
        },
        success: function(info) {
            //console.log(info)
            swal.close();
            $.each(info, function (indice, valor) {
                if (valor.status == '0') {
                    toastr('error', valor.respuesta);
                } else if(valor.status == '1') {
                    toastr('success', valor.respuesta);
                    $('#btn-cufd').prop("disabled",false);
                    $('#generate-cufd-instant').hide("slow");

                    $('#cufdEvento').empty();
                    $('#cufdEvento').html('<option value="'+valor.cufdPrev.codigo+'">'+valor.cufdPrev.codigoControl+' - CÃ³digo de control 2</option>');

                } else if(valor.status == '2') {
                    toastr('info', valor.respuesta);
                }
            });
        }
    });
}

function loadPage(type, route, key){

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: type,
        url: route,
        data: { ejecutar: key },
        cache: false,
        beforeSend: function () {

        },
        success: function(data) {
            $('#contenido').html(data);
            $('#contenido').fadeIn('slow');
        }
    });
}

function returnPage(url){
    var count = 3;
    setInterval(function(){
        count--;
        if (count == 0) {
            location.href = url;
        }
    },1000);
}

function sumaResultados(cambio){
    var importe_total = 0
    $(".stt").each(
        function(index, value) {
            if ($.isNumeric( $(this).val())){
                importe_total = importe_total + eval($(this).val());
            }
        }
    );

    if(cambio > 1){
        $("#sub_total").html((importe_total / cambio).toFixed(2));
    }else{
        $("#sub_total").html(importe_total.toFixed(2));
    }
}

function totaliza(){
    var stt = $("#sub_total").text();
    var desc = $("#descuento_total").text();
    var iva = $("#iva").val();

    var valor = (parseInt(stt) - parseInt(desc));

    //$("#total").text((stt - desc).toFixed(2));
    $("#total").text(stt);

    $("#montoEfectivoCreditoDebito").text((stt * iva/100).toFixed(2));

    totalizacion();
}

function totalizacion(){
    $("#total-factura tbody").each(function(index, value) {
        var sttl = $(this).find('span#sub_total').text();
        var dttl = $(this).find('span#descuento_total').text();
        var mttliva = $(this).find('span#monto_total_sujeto_iva').text();

        var total = $(this).find('span#total').text();

        var medc = $(this).find('span#montoEfectivoCreditoDebito').text();

        //Datos para la factura en B.D.
        $('#subttl').val(sttl - dttl);
        $('#descuentottl').val(dttl);
        $('.montoEfectivoCreditoDebito').val(medc);

        $('#monto_total_sujeto_iva').text((total - dttl).toFixed(2));

        $("#total").text((total - dttl).toFixed(2));

        /*hay duda sobre su procedencia*/
        $('#montoTotalSujetoIva').val(total- dttl);
        $('#montoTotal').val(total- dttl);
        $('#montoTotalMoneda').val(total- dttl);
    });
}

function alertFlash(title, type, messaje, times){
    $('.alert-msjs').show();
    $('.alert-msjs').html(`<div class="alert alert-`+type+` alert-block" style="margin-bottom: 0rem;">
        <button type="button" class="close" data-dismiss="alert">Ã—</button>
        <strong>`+title+`!</strong> <span>`+messaje+`</span>
    </div>`);
    var count = times;
    setInterval(function(){
        count--;
        if (count == 0) {
            $('#alert-msjs').hide('slow');
        }
    },1000);
}

/**
 * Toast
 * @ vars: none
 */
function toastr(icon, res) {
    "use strict";
    $.toast({
        text: res,
        position: 'bottom-right',
        loaderBg: '#ff6849',
        icon: icon,
        hideAfter: 4000,
        stack: 6
    });
}
function SwalFireLoading(title, message){
    Swal.fire({
        title: title,
        text: message,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
        allowOutsideClick: false
    })
}

function SwalFire(title, message){
    Swal.fire({
        title: title,
        text: message
    })
}

/*Steps seccion paquetes de facturas*/
$(document).ready(function(){
    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;

    //Siguiente
    $(".next").click(function(){

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
        $("#progressbar3 li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({'opacity': opacity});
            },
            duration: 600
        });
    });

    //previo
    $(".previous").click(function(){

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        $("#progressbar3 li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({'opacity': opacity});
            },
            duration: 600
        });
    });

    $('.radio-group .radio').click(function(){
        $(this).parent().find('.radio').removeClass('selected');
        $(this).addClass('selected');
    });

    $(".submit").click(function(){
        return false;
    })

});
