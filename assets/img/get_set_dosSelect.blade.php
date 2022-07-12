<div class="dropdown-divider mt-2"></div>
<p class="italic"><small>Información SIAT.</small></p>
<div class="row">
    <div class="form-group col-md-6">
        <label>Actividad</label>
        <select name="actividad_id" id="edit_actividad_id" class="form-control selectpicker">
            <option value="">Seleccionar</option>
            <option value="1">CONSULTORES EN PROYECTOS DE INFORMÁTICA Y SUMINISTRO DE PROGRAMAS DE INFORMÁTICA</option>
            <option value="2">ACTIVIDADES DE DISEÑO E IMPLEMENTACIÓN DE SISTEMAS INFORMÁTICOS</option>
        </select>
    </div>
    <div class="form-group col-md-6" id="edit_codigos">
        <label for="codigo_pro_ser">Producto-Servicio</label>
        <select name="codigo_pro_ser" id="codigo_pro_ser" class="form-control selectpicker" >
        </select>
    </div>
</div>


<script>
    $(function () {
        $('#edit_actividad_id').on('change', onSelectProductoServicioEdit);
    });
    function limpiarEdit() {
        $("#editModal select[name='codigo_pro_ser']").empty();
    }
    function setSeleccionarEdit() {
        $("#editModal select[name='codigo_pro_ser']").append('<option value="">Seleccionar</option>');
    }

    function onSelectProductoServicioEdit() {
        var estatus = $(this).val();
        if (estatus === "") {
            $('#edit_codigos').hide();
            return;
        }
        if (estatus == 1) {

            $.ajax({
                url: 'category/get/'+estatus,
                type: "GET",
                dataType: "json",
                success:function(data) {
                    limpiarEdit();
                    setSeleccionarEdit();
                    for (let i = 0; i < data.length; i++) {
                        $("#editModal select[name='codigo_pro_ser']").append('<option value="'+ data[i].codigo_producto +'">'+ data[i].codigo_producto +' |  '+data[i].descripcion_producto +'</option>');
                    };
                    $('.selectpicker').selectpicker('refresh');
                },
            });
            $('#edit_codigos').show(1000);            
            return;
        }
        if (estatus == 2) {
            
            $.ajax({
                url: 'category/get/'+estatus,
                type: "GET",
                dataType: "json",
                success:function(data) {
                    limpiarEdit();
                    setSeleccionarEdit();
                    for (let i = 0; i < data.length; i++) {
                        $("#editModal select[name='codigo_pro_ser']").append('<option value="'+ data[i].codigo_producto +'">'+ data[i].codigo_producto +' |  '+data[i].descripcion_producto +'</option>');
                    };
                    $('.selectpicker').selectpicker('refresh');
                },
            });
            $('#edit_codigos').show(1000);
            return;
        }
    }
    
    $(document).on("click", ".open-EditCategoryDialog", function(){
        var url ="category/";
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/edit");
        
        $.get(url, function(data){
            $("#editModal input[name='name']").val(data['name']);
            $("#editModal select[name='parent_id']").val(data['parent_id']);
            $("#editModal input[name='category_id']").val(data['id']);
            $("#editModal select[name='actividad_id']").val(data['codigo_actividad']);
            onSelectRefresh();
            $("#editModal select[name='codigo_pro_ser']").val(data['codigo_producto_servicio']);
            $('.selectpicker').selectpicker('refresh');
        });       
        
    });
    
    function onSelectRefresh() {
        var estatus = $("#editModal select[name='actividad_id']").val();
        if (estatus === "") {
            $('#edit_codigos').hide();
            return;
        }
        if (estatus == 1) {

            $.ajax({
                url: 'category/get/'+estatus,
                type: "GET",
                dataType: "json",
                async: false,
                success:function(data) {
                    limpiarEdit();
                    setSeleccionarEdit();
                    for (let i = 0; i < data.length; i++) {
                        $("#editModal select[name='codigo_pro_ser']").append('<option value="'+ data[i].codigo_producto +'">'+ data[i].codigo_producto +' |  '+data[i].descripcion_producto +'</option>');
                    };
                    $('.selectpicker').selectpicker('refresh');
                },
            });
            
            $('#edit_codigos').show();            
            return;
        }
        if (estatus == 2) {
            
            $.ajax({
                url: 'category/get/'+estatus,
                type: "GET",
                dataType: "json",
                async: false,
                success:function(data) {
                    limpiarEdit();
                    setSeleccionarEdit();
                    for (let i = 0; i < data.length; i++) {
                        $("#editModal select[name='codigo_pro_ser']").append('<option value="'+ data[i].codigo_producto +'">'+ data[i].codigo_producto +' |  '+data[i].descripcion_producto +'</option>');
                    };
                    $('.selectpicker').selectpicker('refresh');
                },
            });

            $('#edit_codigos').show();
            return;
        }
    }
</script>