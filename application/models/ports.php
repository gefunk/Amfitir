<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Ports extends CI_Model {

    function __construct()
    {
        parent::__construct();
    }

	/*
	 * given a city id get the cosest port to it
	 */
	function get_closest_port_to_city($city_id){
		// get country code for the city
		$this->db->select('country_code, latitude, longitude')->from('cities')->where('id', $city_id);
		$query = $this->db->get();
		if($query->num_rows() > 0){
			$row = $query->row();
			$country_code = $row->country_code;
			$lat = $row->latitude;
			$lon = $row->longitude;
			// find closest cities based on lat long
			$result = $this->arrange_by_distance_to_city($lat, $lon);
			// if we don't get anything by our funky math, return all the ports in the same country
			if(count($result) <= 0){
				$result = $this->get_ports_in_same_country($country_code);
			}
			
			return $result;
		}
		
		
	}
	
	/**
	 * order the ocean ports by the closest distance to the city
	 */
	function arrange_by_distance_to_city($lat, $lon){
		// remove the decimal from lat long
		$exp_lat = explode('.', $lat);
		$match_lat = $exp_lat[0].'.';
		$match_dec_lat = $exp_lat[1];
		$exp_lon= explode('.', $lon);
		$match_lon = $exp_lon[0].'.';
		$match_dec_lon = $exp_lon[1];
		
		
		$result = null;
		
		// our query is going to try to match the integers in the lat long 
		// ex: 42.654 will be passed to the query 'like 42.%'
		
		$this->db->select('id, name, country_code, latitude, longitude, ABS('.$lat.'-ABS(latitude))+ABS('.$lon.'-ABS(longitude)) as lat_lon_prox')
				 ->from('ports_un')
				 ->where('ocean', 1)
				 ->order_by('lat_lon_prox asc')
				 ->limit(10);
		$query = $this->db->get();
		$result = $query->result();
			
		
		return $result;
	}
	
	/*
	 * given a country get all the ports in the same country
	 */
	function get_ports_in_same_country($country_id){
		$this->db->select('id, name, country_code, latitude, longitude')->from('ports_un')->where('country_code',$country_id);
		$query = $this->db->get();
		return $query->result();
	}
	
	/*
	* get the name of a port given the id
	**/
	function get_port_name($port_id){
		$this->db->select('name')->from('ports_un')->where('id', $port_id);
		$query = $this->db->get();
		$row =  $query->row();
		return $row->name;
	}
	
	function get_port_name_country($port_id){
	    $this->db->select('name, country_code, latitude, longitude')->from('ports_un')->where('id', $port_id);
		$query = $this->db->get();
		$row =  $query->row();
		$result = array(
		  "name" => $row->name,
		  "country" => $row->country_code,
		  "lat" => $row->latitude,
		  "lon" => $row->longitude
		);
		return $result;
	}

	# Where:
	#  $l1 ==> latitude1
	#  $o1 ==> longitude1
	#  $l2 ==> latitude2
	#  $o2 ==> longitude2
	function haversine ($l1, $o1, $l2, $o2)
	{
		$l1 = deg2rad ($l1);
		$sinl1 = sin ($l1);
		$l2 = deg2rad ($l2);
		$o1 = deg2rad ($o1);
		$o2 = deg2rad ($o2);
		return (7926 - 26 * $sinl1) * asin (min (1, 0.707106781186548 * sqrt ((1 - (sin ($l2) * $sinl1) - cos ($l1) * cos ($l2) * cos ($o2 - $o1)))));
	}  
	
	
	
	

}