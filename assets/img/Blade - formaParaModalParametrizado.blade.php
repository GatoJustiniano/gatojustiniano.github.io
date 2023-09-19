@extends('dashboard.master', ['activePage' => 'category'])


@section('content')

    <div class="row">
        <div class="col-12">
            <div class="card">
                <div
                    class="card-header sticky-element bg-label-secondary d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row">
                    <h5 class="card-title mb-sm-0 me-2">Listado de Categorias</h5>
                    <div class="action-btns">
                        <a class="btn btn-label-info me-3" href="{{ URL::previous() }}">
                            Retroceder
                        </a>
                        @can('post.create')
                            <a class="btn btn-label-success " href="{{ route('category.create') }}">
                                Crear
                            </a>
                        @endcan
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive text-nowrap">
                        <table class="table table-sm mb-3">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Título</th>
                                    <th scope="col">Creación</th>
                                    <th scope="col">Actualización</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($categories as $categoria)
                                <tr>
                                    <td>{{ $categoria->id }}</td>
                                    <td>{{ $categoria->title }}</td>
                                    <td>{{ $categoria->created_at->format('Y-m-d') }}</td>
                                    <td>{{ $categoria->updated_at->format('Y-M-d') }}</td>
                                    <td>
                                        @can('category.show')
                                            <a href="{{ route('category.show',$categoria->id) }}" class="btn btn-outline-primary btn-icon ">
                                                <i class="material-icons">person</i>
                                            </a>
                                        @endcan
                                        @can('category.edit')
                                            <a href="{{ route('category.edit',$categoria->id) }}" class="btn btn-outline-primary btn-icon ">
                                                <i class="material-icons">edit</i>
                                            </a>
                                        @endcan

                                        @can('category.destroy')
                                            <button type="button" class="btn btn-outline-danger btn-icon " data-bs-toggle="modal"
                                                data-bs-target="#deleteModal" data-id="{{ $categoria->id }}">
                                                <i class="material-icons">delete</i>
                                            </button>
                                        @endcan

                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                        {{ $categories->links() }}
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <p>Seguro que deseas eliminar la categoria seleccionada?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>

                <form id="formDelete" action="{{ route('category.destroy',0) }}" method="POST" data-action="{{ route('category.destroy',0) }}" >
                    @method('DELETE')
                    @csrf
                    <button type="submit" class="btn btn-danger">Borrar</button>
                </form>

            </div>
            </div>
        </div>
    </div>

    <script>
        window.onload = function () {
            $('#deleteModal').on('show.bs.modal', function (event) {

                var button = $(event.relatedTarget) // Button that triggered the modal
                var id = button.data('id') // Extract info from data-* attributes
                // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

                action = $('#formDelete').attr('data-action').slice(0,-1)

                $('#formDelete').attr('action',action + id )

                var modal = $(this)
                modal.find('.modal-title').text('Vas a borrar la categoría ' + id)
                
            });
        };


    </script>

@endsection
