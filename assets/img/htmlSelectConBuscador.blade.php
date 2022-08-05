<div class="input-group col">
    <label>Sucursal</label>
    <select id="sucursales_id" name="sucursal" class="form-control selectpicker" data-live-search="true" data-live-search-style="begins" title="Seleccionar sucursal...">
        @foreach ($sucursales as $sucursal)
            <option value="{{ $sucursal->sucursal }}">{{ $sucursal->sucursal}}.- {{ $sucursal->nombre}} | {{ $sucursal->direccion }}</option>
        @endforeach
    </select>
</div>

//nota: data-live-search="true" data-live-search-style="begins"
