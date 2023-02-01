// import de from "../assets/plugins/moment/src/locale/de";

$('#labelMasDatosMP' ).click(function() {
    if( $("#masDatosMP").is(':checked') ){
        $("#htmlMetodoPagos").hide('slow');
        $("#masDatosMP").attr("checked", false);
        $(this).removeClass("btn-success");
        $(this).addClass("btn-primary");
        $("#btn-emitir-fac").prop('disabled', false);
    } else {
        $("#htmlMetodoPagos").show('slow');
        metodosPago($("#codigoMetodoPago"));
        $("#masDatosMP").attr("checked", true);
        $(this).removeClass("btn-primary");
        $(this).addClass("btn-success");
        $("#btn-emitir-fac").prop('disabled', true);

    }
});


$("#codigoMetodoPago").on( "change", function() {

    metodosPago($(this)).then(res=>{
        descuento(detalles);
        llenarTabla(detalles,false);
    });

});

function metodosPago(dom){
    return new Promise(resolve => {
        var descripcion = $('option:selected',dom).data("descripcion");
        $("#htmlMetodoPagos").empty();
        $("#numeroTarjeta").val("");
        $("#montoGiftCard").val(0);
        const MPpagos = [
            {metodo:'TARJETA',id:"MPtarjeta"},
            {metodo:'GIFT',id:"MPgiftCard"},
            {metodo:'CHEQUE',id:"MPcheque"},
            {metodo:'VALES',id:"MPvale"},
            {metodo:'OTROS',id:"MPotros"},
            {metodo:'PAGO POSTERIOR',id:"MPpagoPosterior"},
            {metodo:'TRANSFERENCIA BANCARIA',id:"MPtransferenciaBancaria"},
            {metodo:'DEPOSITO',id:"MPdepositoCuenta"},
            {metodo:'SWIFT',id:"MPtransferenciaSwift"},
            {metodo:'EFECTIVO',id:"MPefectivo"},
        ];
        MPpagos.map(x=>{
            if (descripcion.includes(x.metodo)){
                window[x.id]();
            }else{
                $("#"+x.id).hide('slow');
            }
        });
        resolve(true)
    });
}

function MPvalidacion(){
    var suma = parseFloat($("#montoGiftCard").val());
    var montoTotal = parseFloat($("#montoTotal").text());
    var montoCambio = false;
    var arrayID = [];
    $('#htmlMetodoPagos').find('input').each(function() {
        if ($(this).attr('id')!=="numeroCheque" && $(this).attr('id')!=="montoCambio"){
            suma = suma + parseFloat($(this).val());
        }
        if ($(this).attr('id')!=="montoCambio"){
            montoCambio = true
        }
        arrayID.push($(this).attr('id'));
    });

    if (montoCambio){
        let diferencia = suma - montoTotal
        if (diferencia <= 0 ){
            diferencia = 0;
        }
        suma = suma - diferencia;
        $("#montoCambio").val(diferencia)
    }
    if (suma===montoTotal){
        $("#btn-emitir-fac").prop('disabled', false);
        arrayID.map(x=>{
            $("#"+x).removeClass('is-invalid');
            $("#"+x).addClass('is-valid');
            $("#montoGiftCard").removeClass('is-invalid');
            $("#montoGiftCard").addClass('is-valid');
        })
    }else{
        $("#btn-emitir-fac").prop('disabled', true);
        arrayID.map(x=>{
            $("#"+x).removeClass('is-valid');
            $("#"+x).addClass('is-invalid');
            $("#montoGiftCard").removeClass('is-valid');
            $("#montoGiftCard").addClass('is-invalid');
        })
    }
}
function MPtarjeta(){
    $("#MPtarjeta").show('slow');
    let html = `
            <div class="col-6 form-group">
                <label>Monto Tarjeta</label>
                <input class="form-control" onkeyup="MPvalidacion()" type="number" step="0.01" id="montoTarjeta" name="montoTarjeta" min="0" max="1000000" value="0" onKeyPress="return filterFloat(event,this);"/>
            </div>`
    $("#htmlMetodoPagos").append(html);
}

function MPgiftCard(){
    $("#MPgiftCard").show('slow');
}

function MPcheque(){
    let html = `
                <div class="col-lg-6 form-group">
                    <label>Monto Cheque</label>
                    <input class="form-control" onkeyup="MPvalidacion()" type="number" step="0.01" id="montoCheque" min="0" max="1000000" value="0" onkeypress="return filterFloat(event,this);"/>
                </div>
                <div class="col-lg-6 form-group">
                    <label># Cheque</label>
                    <input class="form-control" type="number" step="0.01" id="numeroCheque" min="0" max="1000000" value="0" onkeyup="this.value=this.value.replace(/[^0-9]/g,'');"/>
                </div>`
    $("#htmlMetodoPagos").append(html);
}

function MPefectivo(){
    let html = `
    <div class="col-6 form-group">
        <label>Monto Efectivo</label>
        <input class="form-control" onkeyup="MPvalidacion()" type="number" step="0.01" id="montoEfectivo" min="0" max="1000000" value="0" onKeyPress="return filterFloat(event,this);"/>
    </div>
    <div class="col-6 form-group">
        <label>Monto Cambio</label>
        <input readonly class="form-control" type="number" step="0.01" id="montoCambio" min="0" max="1000000" onKeyPress="return filterFloat(event,this);" value="0" />
    </div>
`
    $("#htmlMetodoPagos").append(html);
}

function MPvale(){
    let html = `<div class="col-6 form-group">
        <label>Monto Vale</label>
        <input type="number" class="form-control" onkeyup="MPvalidacion()" id="montoVale" step="0.01" min="0" max="1000000" value="0" onkeypress="return filterFloat(event,this);"/>
    </div>`
    $("#htmlMetodoPagos").append(html);
}

function MPotros(){
    let html = `<div class="col-6 form-group">
        <label>Monto Otros</label>
        <input type="number" step="0.01" class="form-control" onkeyup="MPvalidacion()" id="montoOtros" min="0" max="1000000" value="0" onkeypress="return filterFloat(event,this);"/>
    </div>`
    $("#htmlMetodoPagos").append(html);
}

function MPpagoPosterior(){
    let html = `<div class="col-6 form-group">
        <label>Monto Pago Posterior</label>
        <input type="number" step="0.01" onkeyup="MPvalidacion()" class="form-control" id="montoPagoPosterior" min="0" max="1000000" value="0" onkeypress="return filterFloat(event,this);"/>
    </div>`
    $("#htmlMetodoPagos").append(html);
}

function MPtransferenciaBancaria(){
    let html = `<div class="col-6 form-group">
        <label>Monto Transferencia Bancaria</label>
        <input type="number" step="0.01" onkeyup="MPvalidacion()" class="form-control" id="montoTransferenciaBancaria" min="0" max="1000000" value="0" onkeypress="return filterFloat(event,this);"/>
    </div>`
    $("#htmlMetodoPagos").append(html);
}

function MPdepositoCuenta(){
    let html = `<div class="col-6 form-group">
        <label>Monto Dep. en Cuenta</label>
        <input type="number" step="0.01" onkeyup="MPvalidacion()" class="form-control" id="montoDepositoCuenta" min="0" max="1000000" value="0" onkeypress="return filterFloat(event,this);"/>
    </div>`
    $("#htmlMetodoPagos").append(html);
}

function MPtransferenciaSwift(){
    let html = `
    <div class="col-6 form-group">
        <label>Monto Transferencia Swift</label>
        <input type="number" step="0.01" onkeyup="MPvalidacion()" class="form-control" id="montoSwift" min="0" max="1000000" value="0"
               onKeyPress="return filterFloat(event,this);"/>
    </div>`;
    $("#htmlMetodoPagos").append(html);
}
