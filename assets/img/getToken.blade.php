public function getToken(){
    $pos_setting    = PosSetting::latest()->first();
    $user_siat      = $pos_setting->user_siat;
    $pass_siat      = $pos_setting->pass_siat;
    $url_siat       = $pos_setting->url_siat;

    $response = Http::post($url_siat.'/TokenRest/v1/token', [
        'dataPassword'  => $user_siat,
        'dataUser'      => $pass_siat,
    ]);
    $token_siat = $response->json('token');
    Session::put('token_siat', $token_siat['token']);
}
