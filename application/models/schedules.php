<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Schedules extends CI_Model {

    function __construct()
    {
        parent::__construct();  
    }
    
    /**
    Given the location find the closest port to it,
    first look at only ports in the same country
    otherwise return ports from other countries
    @params $lat - latitutde, $long - longitude, $country_code - iso country code of location 
    */
    function get_closest_ports($lat, $long, $country)
    {
        $this->db->select("id from country_codes where name = '".$this->db->escape($country)."'");
        $query = $this->db->get();
        if($query->num_rows() > 0)
        {
           $result = $query->row();
           $country_code = $result->id;
           $this->db->select("id, name, country_code, latitude, longitude, ABS((latitude - ".$lat.") + (longitude - ".$long.")) ".
           "as distance from ports_un where country_code = '".$country_code."' and found = 1 order by distance");
           $query = $this->db->get();
		   
		   // if there are no results within the same country get the closest in other countries
		   // limit 5
		   if($query->num_rows() <= 0){
		        $this->db->select("id, name, country_code, latitude, longitude, ABS((latitude - ".$lat.") + (longitude - ".$long.")) ".
                  "as distance from ports_un where found = 1 order by distance limit 5");
                $query = $this->db->get();
		   }
	   }
       return $query->result();
    }
    
    /**
        lookup only routes, not schedules, 
        given a port pair start port and end port
        return if there is a route
    **/
    function lookup_routes($start_port_ids, $end_port_ids, $start_port_lat, $start_port_lon, $end_port_lat, $end_port_lon){
        $results = array();
        $query = $this->db->query("select DISTINCT ". 
        "start_port.port_id as start_port_id, ". 
        "end_port.port_id as end_port_id, ". 
        "start_port_un.name as start_port_name, ".
        "end_port_un.name as end_port_name, ".
        "ABS((start_port_un.latitude - ".$start_port_lat.") + (start_port_un.longitude - ".$start_port_lon.")) as start_port_distance, ".
        "ABS((end_port_un.latitude - ".$end_port_lat.") + (end_port_un.longitude - ".$end_port_lon.")) as end_port_distance ".
        "from ". 
        "stops AS start_port, stops AS end_port, ports_un as start_port_un, ports_un as end_port_un ".
        "where ".
        "start_port.voyage_id = end_port.voyage_id ".
        "and start_port.ship_name = end_port.ship_name ".
        "and start_port.route_id = end_port.route_id ".
        "and start_port.etd < end_port.eta ".
        "and start_port.etd > DATE(NOW()) ".
        "and start_port.port_id = start_port_un.id ".
        "and end_port.port_id = end_port_un.id ".
        "and start_port.port_id in (".$start_port_ids.") ".
        "and end_port.port_id in (".$end_port_ids.") ".
        "order by start_port_distance, end_port_distance");
        
        foreach($query->result() as $row)
        {
           $results[] = array(
           "start_port_id" => $row->start_port_id,
           "end_port_id" => $row->end_port_id,
           "start_port_name" => $row->start_port_name,
           "end_port_name" => $row->end_port_name
           );
        }
        return $results;
    }
    
    function lookup_route_services($start_port_id, $end_port_id, $departure_date, $arrival_date){
        $results = array();
        $query = $this->db->query("select ". 
        "start_port.etd as start_port_etd, ".
        "end_port.eta as end_port_eta, ".
        "start_port.route_id as route_id, ".
        "start_port.ship_name as ship_name, ".
        "start_port.voyage_id as voyage_id, ".
        "DATEDIFF(end_port.eta,start_port.etd) as num_days, ".
        "ss_lines.name as steam_ship_line, ss_lines.bgcolor as background_color, ss_lines.bordercolor as border_color ".
        "from ".
        "stops AS start_port, stops AS end_port, routes, ss_lines ".
        "where ".
        "start_port.voyage_id = end_port.voyage_id ".
        "and start_port.ship_name = end_port.ship_name ".
        "and start_port.route_id = end_port.route_id ".
        "and start_port.etd < end_port.eta ".
        "and start_port.route_id = routes.id ".
        "and ss_lines.id = routes.ss_line_id ".
		"and start_port.etd > '".$departure_date."' ".
		"and end_port.eta < '".$arrival_date."' ".
        "and start_port.port_id = ".$start_port_id.
        " and end_port.port_id = ".$end_port_id.
        " order by start_port_etd");
        
        foreach($query->result() as $row)
        {
           $results[] = array(
           "start_port_etd" => $row->start_port_etd,
           "end_port_eta" => $row->end_port_eta,
           "route_id" => $row->route_id,
           "ship_name" => $row->ship_name,
           "voyage_id" => $row->voyage_id,
           "num_days" => $row->num_days,
           "ss_line" => $row->steam_ship_line,
           "background_color" => $row->background_color,
           "border_color" => $row->border_color
           );
        }
        return $results;
    }
    
    /** 
     given route_id voyage_id, and ship_name get all the ports
     that this voyage stops at
     those 3 elements should make for an unique route in the database
    **/
    function lookup_voyage_info($route_id, $voyage_id, $ship_name)
    {
        $results = array();
        $this->db->select("eta, etd, port, port_id from stops ".
        "where route_id =".$route_id." and voyage_id = ".$this->db->escape($voyage_id).
        " and ship_name = ".$this->db->escape($ship_name));
        
        $query = $this->db->get();
        if($query->num_rows() > 0)
        {
            foreach($query->result() as $row)
            {
                $stop = array(
                    "eta" => $row->eta,
                    "etd" => $row->etd,
                    "port" => $row->port,
                    "port_id" => $row->port_id
                );
                $results[] = $stop;
            }
        }
        
        return $results;
    }
    
    function lookup_schedule($start_port_id, $end_port_id)
    {
        $results = array();
        $this->db->select("voyage_id, ship_name, route_id, eta from stops ".
        "where route_id in (select distinct(route_id) from stops where port_id = ".$start_port_id." and eta > DATE(NOW())) ".
        "and voyage_id in (select distinct(voyage_id) from stops where port_id = ".$start_port_id." and eta > DATE(NOW())) ".
        "and port_id = ".$end_port_id." ".
        "and eta > DATE(NOW()) ".
        "order by eta");
        
        
        $query = $this->db->get();
        if($query->num_rows() > 0)
        {
           foreach($query->result() as $row)
           {
               $voyage_id = $row->voyage_id;
               $ship_name = $row->ship_name;
               $route_id = $row->route_id;
               
               if($this->check_port_direction($voyage_id, $ship_name, $route_id, $start_port_id, $end_port_id))
               {
                    $schedule = array(
                        "route_id" => $route_id,
                        "ship_name" => $ship_name,
                        "voyage_id" => $voyage_id,
                        "schedule" => $this->get_schedule($voyage_id, $ship_name, $route_id, $start_port_id, $end_port_id));
                    $results[] = $schedule;
                }
           }
            
        }
        return $results;
    }
    
    
    
    function get_schedule($voyage_id, $ship_name, $route_id, $start_port_id, $end_port_id)
    {
        $schedule_results = array();
        $this->db->select("stops.eta as eta, ".
        "stops.etd as etd, ".
        "stops.port as port, ".
        "stops.port_id as port_id, ".
        "ports_un.latitude as lat, ".
        "ports_un.longitude as lon ".
        "from stops, ports_un ".
        "where voyage_id = ".$this->db->escape($voyage_id)." ".
        "and ports_un.id = stops.port_id ".
        "and ship_name = ".$this->db->escape($ship_name)." ".
        "and route_id = ".$this->db->escape($route_id)." ".
        "and eta >= ".
            "(select eta from stops where voyage_id = ".$this->db->escape($voyage_id)." ".
            "and ship_name = ".$this->db->escape($ship_name).
            " and route_id = ".$this->db->escape($route_id).
            " and port_id = ".$start_port_id.") ".
        "and eta <= ".
            "(select eta from stops where voyage_id = ".$this->db->escape($voyage_id)." ".
            "and ship_name = ".$this->db->escape($ship_name).
            " and route_id = ".$this->db->escape($route_id).
            " and port_id = ".$end_port_id.") ".
        "order by eta, etd");
        
        $query = $this->db->get();
        if($query->num_rows() > 0)
        {
            foreach($query->result() as $row)
            {
                $schedule_results[] = array(
                                    "port" => $row->port,
                                    "port_id" => $row->port_id,
                                    "eta" => $row->eta,
                                    "etd" => $row->etd,
                                    "lat" => $row->lat,
                                    "lon" => $row->lon
                                        );
            }
        }
        return $schedule_results;
    }
    
    function check_port_direction($voyage_id, $ship_name, $route_id, $start_port_id, $end_port_id)
    {
        $direction = FALSE;
        $this->db->select("eta, port_id from stops ".
        "where voyage_id = ".$this->db->escape($voyage_id)." ".
        "and ship_name = ".$this->db->escape($ship_name)." ".
        "and route_id = ".$route_id." ".
        "and (port_id = ".$start_port_id." or port_id = ".$end_port_id.") ".
        "and eta > DATE(NOW()) ".
        "order by eta");
        
        $query = $this->db->get();
        if($query->num_rows() > 1)
        {
            $start_port_date;
            $end_port_date;
            foreach($query->result() as $row)
            {
                $port_id = $row->port_id;
                $eta = $row->eta;
                if($start_port_id == $port_id)
                {
                    $start_port_date = $eta;
                }
                else
                {
                    $end_port_date = $eta;
                }
            }
            
            if($end_port_date > $start_port_date)
            {
                $direction = TRUE;
            }
        }
        
        return $direction;
        
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
    
}