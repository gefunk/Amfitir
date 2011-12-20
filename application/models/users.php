<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Contact extends CI_Model {

    function __construct()
    {
        parent::__construct();  
    }

	/**
	insert new user, save sign up info
	returns confirmation code to be sent to user email
	**/
	function save_signup_info(
			$name,
			$email,
			$password,
			$company,
			$telephone_no,
			$business_type,
			$city,
			$state,
			$zip,
			$country)
	{
		
		$confirm_code = md5(uniqid(rand()));
		$data = array(
			'name' => $name,
			'email' => $email,
			'password' => $password,
			'company' => $company,
			'telephone' => $telephone_no,
			'bus_type' => $business_type,
			'city' => $city,
			'region_state' => $state,
			'zip' => $zip,
			'country' => $country,
			'confirmed' => 0,
			'confirm_code' => $confirm_code
		);
		
		$this->db->insert('users', $data); 
		
		return $confirm_code;
	}

}