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
		$this->load->library('email');
		//$this->output->enable_profiler(TRUE);
	}
	
	function confirm(){
		// update confirmation code with the rand
		$confirm_code = $this->uri->segment(2);
		if($this->users->confim_user_email($confirm_code)){
			$this->load->view('header');
			$this->load->view('confirm_thankyou');
			$this->load->view('footer');
		}else{
			echo "An error has occured";
		}
	}
	
	function test_confirm_page(){
		$this->load->view('header');
		$this->load->view('confirm_thankyou');
		$this->load->view('footer');
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
		
		$confirm_code = $this->users->save_signup_info(
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
		
		// email confirmation email to user		
		$this->email->from('info@amfitir.com','Amfitir');
		$this->email->to($email);
		$this->email->subject('Please confirm your registration with amfitir -- DO NOT REPLY');
		$this->email->message("Thank you for taking the time to register with Amfitir.com.\n\n".
							"Please click (or copy and paste into your browser) the following link to confirm your email with our system and complete your registration process.\n\n".
							base_url()."confirm/".$confirm_code."\n\n".
							"Thank you,\nThe Team at Amfitir.com\n");
							
		$this->email->send();
		
		
		$this->load->view('header');
		$this->load->view('signup_thankyou');
		$this->load->view('footer');
	}
	
	
}// end controller