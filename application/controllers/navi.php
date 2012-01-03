<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 *
 * @author rgokulnath
 */
class Navi extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->library('session');
		$this->load->helper('url');
		$this->load->model('users');
		//$this->output->enable_profiler(TRUE);
	}
	
	function confirm(){
		echo $this->uri->segment(2);
	}
	/**
	returns false if  user exists already
	true if it does not
	*/
	function check_user_id_does_not_exist(){
		$user_id = $this->input->post("user_id");
		$result = $this->users->check_user_id($user_id);
		echo $result;
	}
	
	/**
	save new user
	*/
	function save_signup_info()
	{
		$name = $this->input->post('name');
		$email = $this->input->post('email');
		$password = $this->input->post('password');
		$company = $this->input->post('company');
		$telephone_no = $this->input->post('telephone_no');
		$business_type = $this->input->post('business_type');
		$city = $this->input->post('city');
		$state = $this->input->post('state');
		$zip = $this->input->post('zip');
		$country = $this->input->post('country');
		
		$this->users->save_signup_info(
				$name,
				$email,
				$password,
				$company,
				$telephone_no,
				$business_type,
				$city,
				$state,
				$zip,
				$country);
				
	}
	
	
}// end controller