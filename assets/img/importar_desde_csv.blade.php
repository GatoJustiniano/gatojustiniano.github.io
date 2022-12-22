<?php 
// El orden correcto de la columna es (customer_group*, name*, company_name, email, phone_number*, address*, city*, state, postal_code, country) y debes seguir esto.


public function importCustomer(Request $request)
    {
        $role = Role::find(Auth::user()->role_id);
        if($role->hasPermissionTo('customers-add')){
            $upload=$request->file('file');
            $ext = pathinfo($upload->getClientOriginalName(), PATHINFO_EXTENSION);
            if($ext != 'csv')
                return redirect()->back()->with('not_permitted', 'Por favor cargue el archivo CSV');
            $filename =  $upload->getClientOriginalName();
            $filePath=$upload->getRealPath();
            //open and read
            $file=fopen($filePath, 'r');
            $header= fgetcsv($file);
            $escapedHeader=[];
            //validate
            foreach ($header as $key => $value) {
                $lheader=strtolower($value);
                $escapedItem=preg_replace('/[^a-z]/', '', $lheader);
                array_push($escapedHeader, $escapedItem);
            }
            //looping through othe columns
            while($columns=fgetcsv($file))
            {
                if($columns[0]=="")
                    continue;
                foreach ($columns as $key => $value) {
                    $value=preg_replace('/\D/','',$value);
                }
                $data= array_combine($escapedHeader, $columns);
                $lims_customer_group_data = CustomerGroup::where('name', $data['customergroup'])->first();
                $customer = Customer::firstOrNew(['name'=>$data['name']]);
                $customer->customer_group_id = $lims_customer_group_data->id;
                $customer->name = $data['name'];
                $customer->company_name = $data['companyname'];
                $customer->email = $data['email'];
                $customer->phone_number = $data['phonenumber'];
                $customer->address = $data['address'];
                $customer->city = $data['city'];
                $customer->state = $data['state'];
                $customer->postal_code = $data['postalcode'];
                $customer->country = $data['country'];
                $customer->is_active = true;
                $customer->save();
                $message = 'Cliente(s) importados con éxito';
                if($data['email']){
                    try{
                        Mail::send( 'mail.customer_create', $data, function( $message ) use ($data)
                        {
                            $message->to( $data['email'] )->subject( 'New Customer' );
                        });
                    }
                    catch(\Exception $e){
                        $message = 'Cliente(s) importados con éxito. Please setup your <a href="setting/mail_setting">mail setting</a> to send mail.';
                    }
                }
            }
            return redirect('customer')->with('import_message', $message);
        }
        else
            return redirect()->back()->with('not_permitted', '¡Lo siento! No tienes permiso para acceder a este módulo.');
    }
