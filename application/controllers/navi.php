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
		//$this->output->enable_profiler(TRUE);
	}
	
	function confirm(){
		echo $this->uri->segment(2);
	}
	
}// end controller