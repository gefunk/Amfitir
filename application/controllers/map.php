<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 *
 * @author rgokulnath
 */
class Map extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->model('ports');
		$this->load->model('loclookup');  
		$this->load->model('schedules'); 
		$this->load->library('session');
		//$this->output->enable_profiler(TRUE);
		$this->load->helper('date');
	}

	function index()
	{
		$this->load->view('map_index');
	}
	
	function run_query()
	{
		// get the user input 
		$origin = $this->input->post('origin');
		$destination = $this->input->post('destination');
		
		// testing purposes
		//$origin = "Atlanta GA";
		//$destination = "Shanghai China";
		
		// find the location
		$origin_location = $this->find_location($origin);
		$destination_location = $this->find_location($destination);		
		// get the closest ports to each location
		$origin_closest_ports = $this->get_closest_ports($origin_location['latitude'], $origin_location['longitude'], $origin_location['country']);
		$destination_closest_ports = $this->get_closest_ports($destination_location['latitude'], $destination_location['longitude'], $destination_location['country']);	
		
		
		// get the schedules and echo them back
		$routes = $this->schedules->lookup_routes($this->convert_array_to_csv($origin_closest_ports), $this->convert_array_to_csv($destination_closest_ports), $origin_location['latitude'], $origin_location['longitude'], $destination_location['latitude'], $destination_location['longitude']);
		
		$data['response'] = false;
		if(sizeof($routes) > 0)
		{
			$data['response'] = true;
			$data['origin'] = $origin_location['name'];
			$data['destination'] = $destination_location['name'];
			$data['routes'] = $routes;
			// put the origin and destination lookup in the session
		}	
        
		echo json_encode($data);
		
	}
	
	function lookup_route_services()
	{
	   $start_port_id = $this->input->post('start_port_id');
	   $end_port_id = $this->input->post('end_port_id');
	   
	   //testing
	   //$start_port_id = "75253";
	   //$end_port_id = "12296";
	   
	   $services = $this->schedules->lookup_route_services($start_port_id, $end_port_id);
	   
	   // first date is the first element in the services, the start_port_etd
	   $begin_date = strtotime($services[0]["start_port_etd"]);
	   // end date is the end_port_eta of the last element in the services array
	   $end_date = strtotime($services[sizeof($services)-1]["end_port_eta"]);
	   
	   // get the date headers and ratios
	   $date_headings = $this->_get_date_headings($begin_date, $end_date);
	   
	   $data['headings'] = $date_headings;
	   
	   foreach($services as &$service){
	       $service = $this->_calculate_padding_size_for_service($service, $begin_date, $end_date);
	   }
	   // break the reference 
	   unset($service);
	   
	   $data['services'] = $services;
	   
	   echo json_encode($data);
	}
	
	function pop_up_info()
	{
	    $route_id = $this->input->post('route_id');
    	$voyage_id = $this->input->post('voyage_id');
    	$ship_name = $this->input->post('ship_name');
    	$start_port_id = $this->input->post('start_port_id');
    	$end_port_id = $this->input->post('end_port_id');
    	
    	/* for testing only
    	$route_id = '236';
    	$voyage_id = '00051S';
    	$ship_name = 'CAP CASTILLO';
    	$start_port_id = 74246;
    	$end_port_id = 55772;
    	*/
    	$ports = $this->schedules->get_schedule($voyage_id, $ship_name, $route_id, $start_port_id, $end_port_id);
    	
    	$data['response'] = true;
    	$data['ports'] = $ports;
    	
    	echo json_encode($data);
	}
	
	
	private function _calculate_padding_size_for_service($service, $begin_date, $end_date){
	    $num_days = $service['num_days'];
	    $start_port_etd = strtotime($service['start_port_etd']);
	    $end_port_eta = strtotime($service['end_port_eta']);
	    $end_date = mktime(0,0,0, date('m', $end_date)+1, date('j', $end_date), date('Y', $end_date));
	    $first_day = gregoriantojd(date("m",$begin_date), 1, date("Y", $begin_date));
    	$end_day = gregoriantojd(date("m",$end_date),1, date("Y", $end_date));
    	$number_of_days = (float) ($end_day - $first_day);
	    
	    $eta_num_days_from_beginning = gregoriantojd(date("m",$start_port_etd), date('j', $start_port_etd), date("Y", $start_port_etd)) - $first_day;
	    $etd_num_days_from_beginning = gregoriantojd(date("m",$end_port_eta), date('j', $end_port_eta), date("Y", $end_port_eta)) - $first_day;
	    
	    $service['left'] = (float) (($eta_num_days_from_beginning/$number_of_days) * 90)+5;
	    $service['width'] = (float) (($etd_num_days_from_beginning/$number_of_days) * 90) - $service['left'];
	    
	    return $service;
	    
	}
	
	/**
	    given start and end date, returns the alphabetic 
	    months e.g.  June, July, August....
	    and ratios for displaying them
	    json representation: {"June":19.736842105263,"July":40.131578947368,"August":60.526315789474,"September":80.263157894737,"October":100.65789473684}
	**/
	private function _get_date_headings($begin_date, $end_date)
	{
	    $end_date = mktime(0,0,0, date('m', $end_date)+1, date('j', $end_date), date('Y', $end_date));

    	   // get the number of days between the first day of the first month and the last day of the last month
    	   // temp_first_day is the first day of the first month in the all the services
    	   $temp_first_day = gregoriantojd(date("m",$begin_date), 1, date("Y", $begin_date));
    	   $temp_end_day = gregoriantojd(date("m",$end_date),date(1, $end_date), date("Y", $end_date));
    	   $number_of_days = (float) ($temp_end_day - $temp_first_day);

    	   // get a list of alphabetic months that are going to be the header of the schedule table
    	   $begin_walk_months = date("m",$begin_date);
    	   $end_walk_months = date("m",$end_date);
    	   
    	   $months = array();
    	   
    	   // put the first month at the beginning, pad 5% to give space in the table at beginning
    	   $months[date("F", $begin_date)] = "5.0";
    	   
    	   
    	   for($i = $begin_walk_months+1; $i <= $end_walk_months-1; $i++){
    	       // get the month
    	       $temp_month = mktime(0,0,0,$i);
    	       // the numer of days from the first day
    	       $temp_num_days_from_first_day = gregoriantojd(date("m",$temp_month), 1, date("Y", $begin_date)) - $temp_first_day;
    	       
    	       // get the padding, using 90 because 10% are reserved for padding
    	       $percentage_of_month = ($temp_num_days_from_first_day/$number_of_days) * 90;
    	       // set the padding into the array
    	       $months[date("F", $temp_month)] = $percentage_of_month;
    	   }
    	   
    	   // put the last month at the end, give 5% padding from the end
    	   $months[date("F", $end_date)] = "95.0";
    	   
    	   return $months;
	}
	
	function get_port_name_country()
	{
	   $port_id = $this->input->post('port_id');
	   $port_name_country = $this->ports->get_port_name_country($port_id);
	   $data['port'] = $port_name_country;
	   echo json_encode($data);
	}
	
	private function get_only_port_combinations($schedules)
	{
		$result = array();
		for($i = 0; $i < sizeof($schedules); $i++){
			foreach($schedules[$i] as $schedule){
			    if(!array_key_exists($schedule['start_port_id'].":".$schedule['end_port_id'], $result)){
				    $result[$schedule['start_port_id'].":".$schedule['end_port_id']] = array(
    					'start_port_id' => $schedule['start_port_id'],
    					'start_port_name' => $schedule['start_port_name'],
    					'end_port_id' => $schedule['end_port_id'],
    					'end_port_name' => $schedule['end_port_name']
    						);
				}
			}
		}
		
		return $result;
	}
	
	/**
	* find the location using geocoding service
	* will get back latitude longitude and location name
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
	* lookup sailing schedules based on start and end ports
	**/
	function convert_array_to_csv($list)
	{	    
        $result = "";
        foreach($list as $val){
            $result .= $val['port_id'].",";
        }
        
        return substr($result, 0, -1);
	}
	
	// test methods
	function test_closest_ports()
	{
	    $result = $this->schedules->get_closest_ports('28.23', '-80.60', 'US');
	    foreach($result as $row)
	    {
	       echo $row->name;
	    }
	}
	
	function test_check_port_direction()
	{
	    $result = $this->schedules->check_port_direction('1107', 'MAERSK MONCTON', 153, 12296, 75253);
	    echo $result;
	    
	}
	
	function test_get_schedule()
	{
	    $result = $this->schedules->get_schedule('421S', 'CMA CGM LA SCALA', 152);
	    foreach($result as $schedule)
	    {
	        echo "Port: ".$schedule['port']." Port_Id: ".$schedule['port_id']." ETA: ".$schedule['eta']." ETD: ".$schedule['etd']."\n";
	    }
	}
	
	function test_lookup_schedule()
	{
	    $result = $this->schedules->lookup_schedule(75253,12296);
	    foreach($result as $voyage)
	    {
	        $route_id = $voyage['route_id'];
	        $ship_name = $voyage['ship_name'];
	        $voyage_id = $voyage['voyage_id'];
	        $schedules = $voyage['schedule'];
	        echo "Route ID: ".$route_id." Ship Name: ".$ship_name." Voyage ID: ".$voyage_id." <br>";
	        foreach($schedules as $schedule)
	        {
	            echo "Port: ".$schedule['port']." Port_Id: ".$schedule['port_id']." ETA: ".$schedule['eta']." ETD: ".$schedule['etd']."<br>";
	        }
	    }
	    
	}
	
	function test_array_to_csv(){
	    $list = array("One","Two","Three");
	    echo $this->convert_array_to_csv($list);
	}
	
}