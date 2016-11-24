<?php

try {
$pdo = new PDO('mysql:host=ja-cdbr-azure-west-a.cloudapp.net;dbname=trehun_db;charset=utf8','b57163c5fb6e9b','1482fce0',
array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 exit('データベース接続失敗。'.$e->getMessage());
}
$insert_member = $_POST['insert_member'];
$stmt = $pdo -> prepare("INSERT INTO member (name) VALUES (:insert_member)");
$stmt->bindParam(':insert_member', $insert_member, PDO::PARAM_STR);
$stmt->execute();

?>