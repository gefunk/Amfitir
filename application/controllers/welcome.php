<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 *
 * @author rgokulnath
 * @property CI_Loader $load
 * @property CI_Input $input
 * @property CI_Output $output
 * @property CI_Email $email
 * @property CI_Form_validation $form_validation
 * @property CI_URI $uri
 * @property Firephp $firephp
 * @property ADOConnection $adodb
 * @property Cities $cities
 */
class Welcome extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->model('cities');
		$this->load->model('ports');
		//$this->output->enable_profiler(TRUE);
	}

	function index()
	{
		$this->load->view('welcome_message');
	}
	
	function search_cities(){
		$city_name = $this->input->post('term');
		$result = $this->cities->search_cities($city_name);
		
		//log_message('debug', 'Value of Term: '.$city_name);
		
		
		
		$data['response'] = 'false'; // set default response
		if(count($result) > 0){
			$data['response'] = 'true'; // set true because we found data
			$data['message'] = array();
			foreach($result as $row){
				$data['message'][] = array('label' => $row->city_name.", ".$row->region_name.", ".$row->country_name, 'value' => $row->city_id);
				//echo $row->city_ascii;
			}
		}
		
		
		echo json_encode($data);
		
	}
	
	function get_city_latlong(){
		$city_id = $this->input->post('city_id');
		$result = $this->cities->get_city_latlong($city_id);
		
		$data['response'] = 'false';
		if(count($result) > 0){
			$data['response'] = 'true';
			$data['latitude'] = $result->latitude;
			$data['longitude'] = $result->longitude;
		}
		
		echo json_encode($data);
	}
	
	function get_ports(){
		$city_id = '292383';//$this->input->post('origin_city_id');
		$result = $this->ports->get_closest_port_to_city($city_id);
		
		$data['response'] = 'false';
		
		if(count($result) > 0){
			$data['response'] = 'true';
			$data['message'] = array();
			foreach($result as $row){
				$data['message'][] = 
					array(	'port_id' => $row->id,
							'name' => $row->name,
							'country_code' => $row->country_code,
							'latitude' => $row->latitude,
							'longitude' => $row->longitude
						 );	
			}
			
		}
		
		echo json_encode($data);
	}
	
	
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */