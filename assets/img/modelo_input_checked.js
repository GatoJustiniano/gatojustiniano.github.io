// botón checked, que debe mostrar pago combinado
// mostrar por consola cuando está seleccionado o deseleccionado
  $("#pago_combinado").click(function () {	
      if ($(this).is(':checked') ) {
          console.log("Checkbox " + $(this).prop("id") +  " (" + $(this).val() + ") => Pago_Combinado Seleccionado");
          $("#div_pago_hidden").show();
          $("#div_tarjeta_hidden").show();
          $("#paid_by_id_select_select").attr('disabled', 'disabled');
      } else {
          console.log("Checkbox " + $(this).prop("id") +  " (" + $(this).val() + ") => Pago_Combinado Deseleccionado");
          $("#div_pago_hidden").hide();
          $("#div_tarjeta_hidden").hide();
          $("#paid_by_id_select_select").removeAttr('disabled');
          $('select[name="tipo_pago_hidden"]').val("");
      }
      $('.selectpicker').selectpicker('refresh');
});
