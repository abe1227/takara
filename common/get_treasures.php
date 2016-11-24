<?php

try {
$pdo = new PDO('mysql:host=ja-cdbr-azure-west-a.cloudapp.net;dbname=trehun_db;charset=utf8','b57163c5fb6e9b','1482fce0',
array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 exit('データベース接続失敗。'.$e->getMessage());
}
$stmt = $pdo -> prepare("SELECT * FROM treasure ORDER BY treasure_id ASC");
$stmt->execute();
 while ($row = $stmt->fetchObject())
    {
        $treasures[] = array(
            'treasure_id'=> $row->treasure_id
            ,'answer' => $row->answer
            ,'max_quantity' => $row->max_quantity
            ,'quantity_count' => $row->quantity_count
            ,'lat' => $row->lat
            ,'lng' => $row->lng
            );
    }

    //JSON形式で出力する
    header('Content-Type: application/json');
    echo json_encode( $treasures );
    exit;


?>