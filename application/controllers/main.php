<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 *
 * @author rgokulnath
 */
class Main extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->model('ports');
		$this->load->model('loclookup');  
		$this->load->model('schedules'); 
		$this->load->model('contact');
		$this->load->model('users');
		$this->load->library('session');
		//$this->output->enable_profiler(TRUE);
		$this->load->library('form_validation');
		$this->load->driver('cache', array('adapter' => 'apc', 'backup' => 'file'));
	}

	function index()
	{
		
		$this->load->view('header');
		
		$this->form_validation->set_rules('to', 'To', 'required');
		$this->form_validation->set_rules('from', 'From', 'required');
		
		if ($this->form_validation->run() == FALSE){
			$this->load->view('search');
			$this->load->view('footer');
		}else{
			$this->load->view('result');
		}
	}
	
	function contact(){
		$this->load->view('header');
		$this->load->view('contact');
		$this->load->view('footer');
	}
	
	function save_contact_info(){
		
		$name = $this->input->post('name');
		$email = $this->input->post('email');
		$company = $this->input->post('company');
		$telephone_no = $this->input->post('telephone_no');
		$business_type = $this->input->post('business_type');
		$message = $this->input->post('message');
		
		$this->contact->save_contact($name, $email, $company, $telephone_no, $business_type, $message);
		
		echo true;
	}
	
	function about(){
		$this->load->view('header');
		$this->load->view('about');
		$this->load->view('footer');
	}
	
	
	function terms(){
		$this->load->view('header');
		$this->load->view('terms');
		$this->load->view('footer');
	}
	
	function signup(){
		$this->load->view('header');
		$this->load->view('signup');
		$this->load->view('footer');
	}
	

	
	function search(){
		$this->load->view('search');
	}
	
	function result()
	{
		$origin = $this->input->post('origin');
		$destination = $this->input->post('destination');
		$arrival_date = $this->input->post('arrive');
		$departure_date = $this->input->post('depart');
		$workspace_id = $this->input->post('workspace_id');
		// set into session data which workspace this search will be saved in
		
		$data = $this->run_query($origin, $destination);
		if($data){
			$this->session->set_userdata("work_".$workspace_id, $origin.":".$destination);
			$data['result'] = true;
			$data['workspace_id'] = $workspace_id;
			$this->load->view('result', $data);
		}else{
			echo false;
		}
	}
	
	/**
	retrieve workspace, based on what is saved in the user session
	*/
	function retrieve_workspace(){
		$workspace_id = $this->input->post('workspace_id');
		// retrieve workspace from session
		$params = explode(":", $this->session->userdata("work_".$workspace_id));
		$origin = $params[0];
		$destination = $params[1];
		$data = $this->run_query($origin, $destination);
		$data['workspace_id'] = $workspace_id;
		$this->load->view('result', $data);
	}
	
	/**
	remove workspace from session, user has closed out a workspace
	*/
	function remove_workspace()
	{
		$workspace_id = $this->input->post('workspace_id');
		$this->session->unset_userdata("work_".$workspace_id);
	}
	
	function loading()
	{
		$this->load->view('header');
		$this->load->view('loading_screen');
		$this->load->view('footer');
	}
	
	/**
	this is for testing the result page only
	*/
	function test_result_page(){
		$origin = "Atlanta GA";
		$destination = "Shanghai China";
		$data = $this->run_query($origin, $destination);
		$data['workspace_id'] = 0;
		$this->load->view('header');
		$this->load->view('result', $data);

	}
	
	function test_str_to_time(){
		echo strtotime("18-0-2012");
	}
	
	function phpinfo(){
		$this->load->view('phpinfo');
	}
	
	function test_cache()
	{
		$cache_key = 'array';
		if(! $data = $this->cache->get($cache_key)){
			$data = array("hello" => 1, "goodbye" => 2);
			// Save into the cache for 5 minutes
			$this->cache->save($cache_key, $data, 5);
		}
		echo "<pre>";
		print_r($data);
		echo "</pre>";
	}

	function run_query($origin, $destination)
	{
		
		//testing purposes
		//$origin = "Atlanta GA";
		//$destination = "Bremerhaven Germany";
		
		// key to be used to retrieve the cache
		$cache_key = $origin."_".$destination;
		// retrieve from cache else re run the query
		if(! $data = $this->cache->get($cache_key)){		
			// get the user input 
			//$origin = $this->input->post('origin');
			//$destination = $this->input->post('destination');
		
			
		
			// find the location
			$origin_location = $this->find_location($origin);
			$destination_location = $this->find_location($destination);		
			// get the closest ports to each location
			$origin_closest_ports = $this->get_closest_ports($origin_location['latitude'], $origin_location['longitude'], $origin_location['country']);
			$destination_closest_ports = $this->get_closest_ports($destination_location['latitude'], $destination_location['longitude'], $destination_location['country']);	
		
		
			// get the schedules and echo them back
			$routes = $this->schedules->lookup_routes($this->convert_array_to_csv($origin_closest_ports), $this->convert_array_to_csv($destination_closest_ports), $origin_location['latitude'], $origin_location['longitude'], $destination_location['latitude'], $destination_location['longitude']);
		

			$data['origin'] = (string) $origin_location['name'];
			$data['destination'] = (string) $destination_location['name'];
			// check if there are routes found
			if(!(is_null($routes)) && count($routes) > 0){
				$data['routes'] = $routes;
			}else{
				// returns false where there are no routes between origin and destination
				return false;
			}
        
	
		
			// Save into the cache for 5 minutes
			$this->cache->save($cache_key, $data, 300);
		}
		
		/* testing purposes only 
		echo "<pre>";
	    print_r($data);
	    echo "</pre>";
		*/
		return $data;
		
	}
	
	/**
	 find the location using geocoding service
	 will get back latitude longitude and location name
	**/
	function find_location($location)
	{
	    $result = $this->loclookup->get_location($location);
	    return $result;
	}
	
	/**
	    get the closest ports to the lat long country
	**/
	function get_closest_ports($lat, $long, $country)
	{
        
        $result = $this->schedules->get_closest_ports($lat, $long, $country);
        
        $ports = array();
        foreach($result as $row){
        	$ports[] = array(	'port_id' => $row->id,
						'name' => $row->name,
						'country' => $row->country_code,
						'latitude' => $row->latitude,
						'longitude' => $row->longitude
					);	
        }
		return $ports;
		
	}
	
	/**
	 lookup sailing schedules based on start and end ports
	**/
	function convert_array_to_csv($list)
	{	    
        $result = "";
        foreach($list as $val){
            $result .= $val['port_id'].",";
        }
        
        return substr($result, 0, -1);
	}

}