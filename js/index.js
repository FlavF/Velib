$(document).ready(function() {
	///! VARIABLES
	let marker;
	let name;
	let address;
	let map;
	let zoom = 13;
	// const CITY = "brisbane";
	const CITY = "dublin";
	const API_KEY = "c565bedfbf44913720d6d4b44aa05254b575cb12";

	/// html id pour ajouter la liste
	let urlList =
		"https://api.jcdecaux.com/vls/v3/stations?contract=" +
		CITY +
		"&apiKey=" +
		API_KEY;

		console.log(urlList)


	//! FONCTIONS

	// fonction qui charge la liste des noms des adresses velib
	function loadList(data) {
		let station = data;
		console.log(station);

		// list des noms de stations 
		for (let i = 0; i < station.length; i++) {
			let name = station[i].name;
			let number = station[i].number;
			$("#address").append(`
            <li data-number="${number}"> ${name} </li>`);
		}
	}

	// fonction qui va récupérer le numéro de la station sur laquelle on clique
	function onClick() {
		// récupère le numéro de la station
		let stationNumber = $(this).data("number");
		console.log(stationNumber);

		// récupère l'url avec le numéro de la station sur laquelle on clique
		let url =
			"https://api.jcdecaux.com/vls/v3/stations/" + stationNumber + "?contract=" + CITY +"&apiKey=" + API_KEY;
		console.log(url);

		// appel la fonction pour mettre dans la div id= details les informations de la stations
		$.get(url, showDetail);
	}

	// ajouter les informations de la station
	function showDetail(station) {
		// met dans la div  id= details 
						// possibilité de mettre directement dans le html dans des p au lieu de la div details (id à créer sur html)/
		$("#details").html(`
        <h2>Station Name is : </h2>
            <p> ${station.name}</p>
        <h2>Station Adress is :</h2>
            <p> ${station.address}</p>
         <h2>Station Status is :</h2>
            <p> ${station.status}</p>
         <h2>Station Capacity :</h2>
            <p> ${station.totalStands.capacity}</p>
         <h3>Station Capacity Details are :</h3>
            <h4>Bikes number :</h4>
                <p> ${station.totalStands.availabilities.bikes}</p>
            <h4>Stands free :</h4>
                <p> ${station.totalStands.availabilities.stands}</p>
			<h3>GPS :</h3>
				<p> ${station.position.latitude}, ${station.position.longitude}</p>
        `);

		

		// création de la map ou deplacement de la carte
		if (map == null) {
			map = new L.map("mapid").setView(
				[station.position.latitude, station.position.longitude],
				zoom
			);
			console.log(map);
			// dessiner la map
			const mainLayer = L.tileLayer(
				"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
				{
					attribution:
						'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 18,
					id: "mapbox/streets-v11",
					tileSize: 512,
					zoomOffset: -1,
					accessToken:
						"pk.eyJ1IjoiZmxhdmYiLCJhIjoiY2tsODk2ZmtnMG56ZjJwcjJ3Y2I1bTA5dCJ9.4hQZ-QHrDcX_sIhLyft_jA",
				}
			);
			mainLayer.addTo(map);

			// montrer la station sur la carte
			marker = L.marker([
				station.position.latitude,
				station.position.longitude,
			]).addTo(map);

			// pop up avec le nom de la station
			name = station.name;
			address = station.address;
			marker.bindPopup(name + "<br>" + address).openPopup();
		}
		// quand on a déjà créer la map (bouger la map sur la nouvelle station)
		else {
			map.panTo(
				new L.LatLng(station.position.latitude, station.position.longitude)
			);
			// montrer la station sur la carte
			marker = L.marker([
				station.position.latitude,
				station.position.longitude,
			]).addTo(map);

			// pop up avec le nom de la station
			name = station.name;
			address = station.address;
			marker.bindPopup(name + "<br>" + address).openPopup();
		}
	}

	////! CODE /////

	// récupère les listes des adresses velib
	$.get(urlList, loadList);

	// récupère les clicks sur les li (une fois que li affiché)
	$("#address").on("click", "li", onClick);
});
