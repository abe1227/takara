<?php
try {
$pdo = new PDO('mysql:host=ja-cdbr-azure-west-a.cloudapp.net;dbname=trehun_db;charset=utf8','b57163c5fb6e9b','1482fce0',
array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 exit('データベース接続失敗。'.$e->getMessage());
}
$treasure_id = $_POST['treasure_id'];
$echo_message = "true";
$stmt = $pdo -> prepare("SELECT * FROM treasure WHERE treasure_id = :treasure_id");
$stmt -> bindParam(':treasure_id', $treasure_id, PDO::PARAM_STR);
$stmt->execute();
$quantity = $stmt->fetchAll();
    if ($quantity[0]['max_quantity'] > $quantity[0]['quantity_count']) {
    }else{
        $echo_message = "false";
    }
echo $echo_message;
?>