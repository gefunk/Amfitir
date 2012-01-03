<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends CI_Model {

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
	
	/**
	check whether this user is already registered in system
	runs a query for the user_id (email address), is already registered
	*/
	function check_user_id($user_id)
	{
		$this->db->select('email');
		$this->db->from('users');
		$this->db->where('email', $user_id); 
		
		$query = $this->db->get();
		
		if ($query->num_rows() > 0){
			return false;
		}
		
		return true;
	}
	
	function confim_user_email($confirm_code)
	{
		$this->db->select('confirm_code');
		$this->db->from('users');
		$this->db->where('confirm_code', $confirm_code); 

		$query = $this->db->get();
		// true
		if ($query->num_rows() == 1){
			$data = array('confirmed' => 1);
			$this->db->where('confirm_code', $confirm_code); 
			$this->db->update('users', $data);
			return true;
		}
		
		return false;
	}
}