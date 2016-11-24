<?php
try {
$pdo = new PDO('mysql:host=ja-cdbr-azure-west-a.cloudapp.net;dbname=trehun_db;charset=utf8','b57163c5fb6e9b','1482fce0',
array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 exit('データベース接続失敗。'.$e->getMessage());
}
$code = $_POST['code'];
$stmt = $pdo -> prepare("SELECT * FROM stamp WHERE code = :code");
$stmt -> bindParam(':code', $code, PDO::PARAM_STR);
$stmt->execute();

 while ($row = $stmt->fetchObject())
    {
        $stamps[] = array(
            'stamp_id'=> $row->stamp_id
            ,'name' => $row->name
            ,'image_url' => $row->image_url
            ,'lat' => $row->lat
            ,'lng' => $row->lng
            ,'code' => $row->code
        );
    }

    //JSON形式で出力する
    header('Content-Type: application/json');
    echo json_encode( $stamps );
    exit;
    //引数：code　戻り値:　存在すれば
?>