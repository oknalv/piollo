<?php
	function loadclasses($ident) {
		include("classes/".$ident.".php");
	}
	spl_autoload_register("loadclasses");
