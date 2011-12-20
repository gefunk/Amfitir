<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Contact extends CI_Model {

    function __construct()
    {
        parent::__construct();  
    }
	
	function save_contact($name, $email, $company, $telephone_no, $type_of_business, $message){
		$data = array(
			'name' => $name,
			'email' => $email,
			'company' => $company,
			'telephone_no' => $telephone_no,
			'type_of_business' => $type_of_business,
			'message' => $message
		);
		
		$this->db->insert('contact', $data);
	}

}