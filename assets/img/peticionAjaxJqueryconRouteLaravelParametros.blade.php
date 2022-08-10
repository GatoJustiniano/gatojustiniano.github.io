//permite usar los name o route de Laravel
if (estatus) {
      var id = estatus;
      var url = '{{ route("category-get", ":id") }}';
      url = url.replace(':id', id);

      $.ajax({
          url: url,
          type: "GET",
          dataType: "json",
          success:function(data) {
              limpiar();
              console.log(estatus);
              console.log(data);
              for (let i = 0; i < data.length; i++) {
                  $("select[name='codigo_pro_ser']").append('<option value="'+ data[i].codigo_producto +'">'+ data[i].codigo_producto +' - '+data[i].descripcion_producto +'</option>');
              };
              $('.selectpicker').selectpicker('refresh');
          },
      });
  }
