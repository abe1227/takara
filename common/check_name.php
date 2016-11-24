<?php
try {
$pdo = new PDO('mysql:host=ja-cdbr-azure-west-a.cloudapp.net;dbname=trehun_db;charset=utf8','b57163c5fb6e9b','1482fce0',
array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 exit('データベース接続失敗。'.$e->getMessage());
}
$check_name = $_POST['check_name'];
$stmt = $pdo -> prepare("SELECT * FROM member WHERE name = :check_name ORDER BY member_id ASC");
$stmt -> bindParam(':check_name', $check_name, PDO::PARAM_STR);
$stmt -> execute();
$count = $stmt -> rowCount();
if ($count == 0) {
    echo "true";
}else{
    echo "false";
}
//引数　POST[check_name] 戻り値　同名があればfalse なければtrue
?>