$(document).ready(function (){
    $(document).on('keyup click blur','#descuentoProporcional',function(e){
        formatNumberInput(e,$(this))
        if (parseFloat($(this).val())>99){
            let value = '99'
            $(this).val(value)
            toastr('error','Maximo permito ' +value)
        }
        if (parseFloat($(this).val())<0){
            $(this).val('0');
            toastr('error','Minimo permito 0')
        }

        descuento(detalles);
        llenarTabla(detalles)
    });

    $(document).on('keyup click blur','#descuentoAdicional',function(e){
        formatNumberInput(e,$(this))

        let arrayDescAdi=$(this).val().split(".");
        if (arrayDescAdi.length>=2){
            if (arrayDescAdi[1].length>2){
                $(this).val(parseFloat($(this).val()).toFixed(2))
            }
        }
        var subtotal = parseFloat($("#subTotal").text());
        var descAdic = parseFloat($(this).val());
        var desdeta = parseFloat($("#descdetalle").val());
        if ((descAdic+desdeta>=subtotal)&&subtotal!=0){
            $("#descuentoAdicional").val(((subtotal-desdeta)-0.01).toFixed(2));
            toastr("error",'El descuento adicional no debe ser mayor o igual al total ')
        }
        descuento(detalles);
        llenarTabla(detalles,false);
    });


    $(document).on('keyup click blur','.calcular',function(e){
        e.preventDefault();
        formatNumberInput(e,$(this))
        var cantidad = $(this).closest('tr').find('input.cantidad').val();
        var precioUnitario = $(this).closest('tr').find('input.precioUnitario').val();
        var montoDescuento = $(this).closest('tr').find('input.detalleDescuento').val();

        if ($(".tipo_desc").val() === 'd' && parseFloat(montoDescuento)<0){
            $(this).closest('tr').find('input.detalleDescuento').val('0.00')
            montoDescuento=0
            toastr("error", "El descuento no debe ser menor a 0.01")
        }

        let subTotal = (mul(cantidad,precioUnitario));
        if ($(".tipo_desc").val() === 'd' && parseFloat(montoDescuento)>=subTotal && parseInt($("#codigoDocumentoSector").val())!==35){
            let aux = res(subTotal,0.01) ;
            let desc=res(subTotal,aux) ;
            $(this).closest('tr').find('input.detalleDescuento').val(desc);
            montoDescuento = desc;
            subTotal = res(mul(cantidad,precioUnitario),montoDescuento);
            toastr("error", "El descuento no debe ser mayor al subtotal");
        }else{
            subTotal = res(mul(cantidad,precioUnitario),montoDescuento);
        }

        detalles[$(this).data('id')].cantidad= cantidad;
        detalles[$(this).data('id')].precioUnitario= precioUnitario;
        detalles[$(this).data('id')].montoDescuento = montoDescuento;
        detalles[$(this).data('id')].subTotal = subTotal;

        descuento(detalles);
        llenarTabla(detalles,false);

        if (parseFloat(cantidad)<=0){
            $(this).closest('tr').find('input.cantidad').addClass("is-invalid");
        }else{
            $(this).closest('tr').find('input.cantidad').removeClass("is-invalid");
        }
        if (parseFloat(precioUnitario)<=0){
            $(this).closest('tr').find('input.precioUnitario').addClass("is-invalid");
        }else{
            $(this).closest('tr').find('input.precioUnitario').removeClass("is-invalid");
        }
    });
    $(document).on('keyup click blur','#montoGiftCard',function(e){
        e.preventDefault();
        formatNumberInput(e,$(this))
        descuento(detalles);
        llenarTabla(detalles,false);
    });

    $(document).on('click','.cerrar-fila',function(e){
        e.preventDefault();
        detalles.splice($(this).data('id'), 1);
        descuento(detalles)
        llenarTabla(detalles)
    });

    $(document).on('click','#add_descuento',function(e){
        $('#clave_autorizacion').toggle("slow");
        $('#clave_auth').focus();
    });

    $(".tipo_desc").on( "click", function(e) {
        if ($(this).val()=="d"){
            $("#descuentoProporcional").hide('slow');
        }else{
            $("#descuentoProporcional").show('slow');
        }
        descuento(detalles);
        llenarTabla(detalles);
    });


    $(document).on('change','#sucursal',function(e){
        llenarPuntoVenta($(this).val(),$("#codigoPuntoVenta"));
    })
    $(document).on('change','select#actividad',function(e){
        numeroFactura($(this).val(),$("#sucursal").val(),$("#codigoPuntoVenta").val())
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: route('default-actv'),
            data: {
                valor:1,
                codigoCaeb:$(this).val()
            },
            success: function (data) {
                $("#caja2").css('background', data.color);
            },
            error: function (jqXHR) {
                console.log(jqXHR)
            }
        })
    })
    $(document).on('change','select#sucursal',function(e){
        numeroFactura($("#actividad").val(),$(this).val(),$("#codigoPuntoVenta").val())
    })
    $(document).on('change','select#codigoPuntoVenta',function(e){
        numeroFactura($("#actividad").val(),$("#sucursal").val(),$(this).val())
    })
    $(document).on('click','#refresh-numeroFactura',function(e){
        numeroFactura($("#actividad").val(),$("#sucursal").val(),$("#codigoPuntoVenta").val(),true);
    });



    //MODAL DESCRIPCION ADICIONAL

    $("#btn-modal-confir").click(function (){
        let id = parseInt($("#valid").val());
        var descrAdic = $("#descripAdic").val().toUpperCase();
        detalles[id].descripcionAdicional =descrAdic;

        if (descrAdic!==''){
            descrAdic = ", "+descrAdic;
        }

        detalles[id].descripcion =detalles[id].descripcionOriginal + descrAdic;
        $("#tr-"+id).closest('tr').find('span.description').text(detalles[id].descripcion);
        $('#add_descrip').modal('hide');

    });

    $(document).on('click','.add_descrip',function(e){
        e.preventDefault();
        var es = $(this);
        var descripcion = detalles[es.data("id")].descripcionAdicional;

        $("#titulo-modal").text(detalles[es.data("id")].descripcion);

        $("#descripAdic").val(descripcion)
        $("#valid").val(es.data("id"))
        $('#add_descrip').modal('show');

    });



});

function descuento(detalles){
    var descuento = parseFloat($("#descuentoProporcional").val());///extrameos el valor del descuento

    if($('input[name=tipo_descuento]:checked').val() === 'p' && descuento>0) {
        var porcentaje = div(parseFloat($("#descuentoProporcional").val()),100);
        detalles.map(x=>{
            let subTotal = mul(x.precioUnitario,x.cantidad);
            let montoDescuento = mul(subTotal,porcentaje);
            x.montoDescuento = montoDescuento;
            x.subTotal = res(subTotal,montoDescuento);
        });
    }
}




function sendFactura2(data,routepost){
    return new Promise(function (resolve, reject) {
        var descripcion = $("#codigoMetodoPago option:selected").data("descripcion");
        var metodosPagos=null;
        if( $('#masDatosMP').prop('checked') ) {
            metodosPagos = {
                "descripcion":descripcion,
                "MONTO TARJETA":$("#montoTarjeta").val(),
                "MONTO CHEQUE":$("#montoCheque").val(),
                "NUMERO CHEQUE":$("#numeroCheque").val(),
                "MONTO VALE":$("#montoVale").val(),
                "MONTO OTROS":$("#montoOtros").val(),
                "MONTO PAGO POSTERIOR":$("#montoPagoPosterior").val(),
                "MONTO TRANSFERENCIA":$("#montoTransferenciaBancaria").val(),
                "MONTO DEPOSITO":$("#montoDepositoCuenta").val(),
                "MONTO SWIFT":$("#montoSwift").val(),
                "MONTO EFECTIVO":$("#montoEfectivo").val(),
                "MONTO CAMBIO":$("#montoCambio").val(),
            }
        }
        jQuery.extend(data,{
            codigoSucursal:$("#sucursal").val(),
            codigoPuntoVenta:$("#codigoPuntoVenta").val(),
            codigoTipoDocumentoIdentidad:$("#codigoTipoDocumentoIdentidad").val(),
            complemento:$("#complemento").val(),
            codigoCliente:$("#codigoCliente").val(),
            codigoMetodoPago:$("#codigoMetodoPago").val(),
            cafc:$("#codeCafc").val(),
            descuentoAdicional:$("#descuentoAdicional").val(),
            codigoExcepcion:$("#nitInvalido").val(),
            montoTotal:$("#montoTotal").text(),
            montoTotalSujetoIva:$("#montoTotalSujetoIva").text(),
            montoTotalMoneda:$("#montoTotalMoneda").text(),
            montoGiftCard:$("#montoGiftCard").val(),
            numeroFactura:$("#numeroFactura").val(),
            nombreRazonSocial:$("#nombreRazonSocial").val(),
            numeroTarjeta:$("#numeroTarjeta").val(),
            numeroDocumento:$("#numeroDocumento").val(),
            codigoMoneda:$(".tipoCambio:checked").data("codigomoneda"),
            NitVerificadoSiat:$("#verificadoSiat").val(),
            tipoCambio:$(".tipoCambio:checked").val(),
            tipoEmision:$("#tipoEmision").val(),
            // tipoFactura:$("#tipoFactura").val(),
            email:$("#email").val(),

            evento_id:$("#evento_id").val(),
            fechaEmision:$("#fechaEmision").val(),
            pagos:metodosPagos
        });
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
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
            url: routepost,
            data: data,
            success: function (info) {
                swa.close();
                switch (info.status){
                    case 0:
                        toastr(info.icon,info.details);
                        reject(info)
                        break;
                    case 1:
                        info.details.map(x=>{
                            toastr(info.icon,x);
                        });
                        reject(info)
                        break;
                    case 2:
                        info.details.map(x=>{
                            if (x.codigo==1037){
                                $("#domEmail").addClass('bg-danger');
                                $("#domNitInvalido").show('slow');
                            }
                            if (x.codigo == 953) {
                                $(".cufdemi").show('slow');
                                $(".cufdemi").attr('data-cpv', $("#codigoPuntoVenta").val());
                                $(".cufdemi").attr('data-suc', $("#sucursal").val());
                            }
                            toastr(info.icon, x.descripcion)

                        });
                        reject(info)
                        break;
                    case 10:
                        if( $("#masDatosMP").is(':checked') ){
                            $('#labelMasDatosMP' ).click();
                            $('#labelMasDatosMP' ).click();
                        }
                        if (info.tipoemi===2){
                            notifynavbar();
                            if (!info.cafc){
                                conexOn();
                            }
                        }else if (info.tipoemi===1){
                            if(info.evento.status==1){
                                conexOn();
                            }
                        }
                        $("#viewPdfModal").show("slow");
                        $("#viewPdfModal").attr("data-id",info.id);
                        $("#items-factura > tbody").empty();
                        let numfac = parseInt($("#numeroFactura").val());
                        $("#numeroFactura").val(numfac + 1);


                        $("#descuento").val('0');
                        $("#descuentoAdicional").val('0');
                        $("#montoGiftCard").val('0');
                        $("#numeroTarjeta").val('');
                        $("#clave_autorizacion").hide('slow');

                        $("#subTotal").text('0.00');
                        $("#descuento_total").text('0.00');
                        $("#montoTotalSujetoIva").text('0.00');
                        $("#montoTotalMoneda").text('0.00');
                        $("#montoTotal").text('0.00');
                        $("#notaPetrex").val("");

                        $("#domEmail").removeClass('bg-danger');
                        $("#domNitInvalido").hide('slow');
                        $("#checkNitInvalido").prop("checked", false);

                        detalles = [];
                        toastr(info.icon,info.details);
                        resolve(info)
                        break;
                }

            },
            error: function (error) {
                console.log(error)
                swa.close();
                if (error.status==422){
                    error.responseJSON.errors.details.map(x=>{
                        toastr("error",x);
                    })
                }else{
                    toastr("error","Error del servidor");
                }
                reject(error)
            }
        })
    });

}


function limNumDec(e, count) {
    if (count===0){
        e.target.value = e.target.value.replace(/\D/g, '');
    }else{
        e.target.value = e.target.value.replace(/[^\d.]|\.(?=.*\.)/g, '');
    }
    if (e.target.value.indexOf('.') === -1) { return; }
    let arr = e.target.value.split('.');
    if (arr[1].length>count){
        e.target.value = arr[0]+"."+arr[1].substr(0,count)
    }
}
function limNumInt(e) {
    e.target.value = e.target.value.replace(/^((100(\.0{1,2})?)|(\d{1,2}(\.\d{1,2})?))$/g, '');
}
function limLength(e,max) {
    if (''+e.target.value.length > max){
        e.target.value = e.target.value.substr(0,max);
    }
}

function mul(x,y, deci = dec){
    return new Decimal(x).mul(y).toDecimalPlaces(deci).toNumber();
}

function sum(a,b,deci = dec){
    a=a?a:0;
    b=b?b:0;
    return new Decimal(a).add(b).toDecimalPlaces(deci).toNumber();
}
function res(a,b,deci = dec){
    a=a?a:0;
    b=b?b:0;
    return new Decimal(a).sub(b).toDecimalPlaces(deci).toNumber();
}
function div(a,b,deci = dec){
    a=a?a:0;
    b=b?b:0;
    return new Decimal(a).div(b).toDecimalPlaces(deci).toNumber();
}

function formatNumberInput(event,e){
    if (event.type==="click"){
        let valArray = e.val().split('.');
        if (parseFloat(e.val())===0) {
            e.val("");
        }else if(parseFloat(valArray[1])==0){
            e.val(valArray[0]);
        }
    }
    if (event.type==="focusout"){
        if (e.val()==='') {
            e.val('0.00');
        }else{
            let val = parseFloat(e.val()).toFixed(dec)
            if (decCant){
                if (e.hasClass("cantidad")) {
                    val = parseFloat(e.val()).toFixed(decCant)
                }
            }
            e.val(val);
        }
    }
}
function formatNumberInput2(event,e){
    if (event.type==="click"){
        let valArray = e.val().split('.');
        if (parseFloat(e.val())===0) {
            e.val("");
        }else if(parseFloat(valArray[1])==0){
            e.val(valArray[0]);
        }
    }
    if (event.type==="focusout"){
        if (e.val()==='') {
            e.val('0.00');
        }else{
            let val = parseFloat(e.val()).toFixed(2)
            e.val(val);
        }
    }
}

