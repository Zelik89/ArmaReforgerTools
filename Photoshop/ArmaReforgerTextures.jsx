#target photoshop
//Author: Zelik
app.bringToFront();

var Black = new SolidColor();
Black.rgb["hexValue"] = '000000';


var dialog = new Window("dialog", "", undefined, {resizeable: true} );
dialog.text = "Arma Reforger Texture Tool";
dialog.orientation = "row";
dialog.alignChildren = ["fill", "fill"];
dialog.spacing = 0;
dialog.margins = 2;

var BCR_Button = dialog.add("button", undefined, undefined, { name: "BCR" });
BCR_Button.text = "BCR";

var NMO_Button = dialog.add("button", undefined, undefined, { name: "NMO" });
NMO_Button.text = "NMO";

var NHO_Button = dialog.add("button", undefined, undefined, { name: "NHO" });
NHO_Button.text = "NHO";

BCR_Button.onClick = function() 
{
var selectedFolder = Folder.selectDialog("Please select folder");

	if(selectedFolder != null)
	{
		var fileList = selectedFolder.getFiles(/\.(tga)$/i); 
	}

	for(var a = 0 ;a < fileList.length; a++)
	{

		if(fileList[a].name.indexOf('_Roughness') != -1)
		{
			open(fileList[a]);
		}
		
		if(fileList[a].name.indexOf('_Albedo') != -1)
		{
			open(fileList[a]);
		}
	}
	dialog.hide();
	CopyRoughness();
};

NMO_Button.onClick = function() 
{
var selectedFolder = Folder.selectDialog("Please select folder");

	if(selectedFolder != null)
	{
		var fileList = selectedFolder.getFiles(/\.(tga)$/i); 
	}

	for(var a = 0 ;a < fileList.length; a++)
	{

		if(fileList[a].name.indexOf('_Metallic') != -1)
		{
			var docRef = open(fileList[a]);
			docRef.activeLayer.isBackgroundLayer = false;
			var  Metallic = docRef.artLayers.getByName("Layer 0");
			Metallic.name = "Metallic";
		}
		
		if(fileList[a].name.indexOf('_Normal') != -1)
		{
			open(fileList[a]);
		}
		
		if(fileList[a].name.indexOf('_AO') != -1)
		{
			open(fileList[a]);
		}
	}
	dialog.hide();
	DetermineMetallic();
};

NHO_Button.onClick = function() 
{
var selectedFolder = Folder.selectDialog("Please select folder");

	if(selectedFolder != null)
	{
		var fileList = selectedFolder.getFiles(/\.(tga)$/i); 
	}

	for(var a = 0 ;a < fileList.length; a++)
	{

		if(fileList[a].name.indexOf('_Height') != -1)
		{
			var docRef = open(fileList[a]);
		}
		
		if(fileList[a].name.indexOf('_Normal') != -1)
		{
			var docRef = open(fileList[a]);
			docRef.activeLayer.isBackgroundLayer = false;
			var  Normal= docRef.artLayers.getByName("Layer 0");
			Normal.name = "Normal";
		}
		
		if(fileList[a].name.indexOf('_AO') != -1)
		{
			open(fileList[a]);
		}
	}
	dialog.hide();
	DetermineNormal();
};

function DetermineNormal() 
{
	activeFile = app.activeDocument;
	selectChannel('red');
	activeFile.selection.selectAll();
	activeFile.selection.copy();
	
	app.activeDocument = app.documents[1];	
	activeFile = app.activeDocument;
	selectChannel('red');
	activeFile.selection.selectAll();
	activeFile.paste();
	
	app.activeDocument = app.documents[2];
	activeFile = app.activeDocument;
	var  layerRef = activeFile.artLayers.getByName("Normal");
	activeFile.activeLayer = layerRef;
	selectChannel('green');
	activeFile.selection.selectAll();
	activeFile.selection.copy();
	activeFile.close(SaveOptions.DONOTSAVECHANGES);
	
	activeFile = app.activeDocument;
	selectChannel('green');
	activeFile.selection.selectAll();
	activeFile.paste();

	app.activeDocument = app.documents[0];
	activeFile = app.activeDocument;
	activeFile.selection.selectAll();
	activeFile.selection.copy();
	activeFile.close(SaveOptions.DONOTSAVECHANGES);
	NHO();

};

function NHO()
{
	activeFile = app.activeDocument;
	makeChannel();
	clipboardToAlpha("Alpha 1");
	saveTarga32(activeFile);
	activeFile.close(SaveOptions.DONOTSAVECHANGES);	

};

function DetermineMetallic() 
{

	if(app.documents.length < 3)
	{
		activeFile = app.activeDocument;
		var layerRef = activeFile.artLayers.add();
		layerRef.name = "Metallic";		
		activeFile.activeLayer = layerRef;
		activeFile.selection.selectAll();
		activeFile.selection.fill(Black);
		activeFile.selection.copy();
		var Layers = activeFile.artLayers;
		Layers[0].remove();
		selectChannel('blue');
		activeFile.selection.selectAll();
		activeFile.paste();
	}
	else
	{
		app.activeDocument = app.documents[1];
		activeFile = app.activeDocument;
		var  layerRef = activeFile.artLayers.getByName("Metallic");
		activeFile.activeLayer = layerRef;
		activeFile.selection.selectAll();
		activeFile.selection.copy();
		activeFile.close(SaveOptions.DONOTSAVECHANGES);
		activeFile = app.activeDocument;
		selectChannel('blue');
		activeFile.selection.selectAll();
		activeFile.paste();
	}
	DetermineAO();
};

function DetermineAO() 
{
	app.activeDocument = app.documents[0];
	activeFile = app.activeDocument;
	activeFile.selection.selectAll();
	activeFile.selection.copy();
	activeFile.close(SaveOptions.DONOTSAVECHANGES);
	activeFile = app.activeDocument;
	makeChannel();
	clipboardToAlpha("Alpha 1");
	activeFile.selection.selectAll();
	activeFile.paste();
	NMO();
};

function NMO()
{
	activeFile = app.activeDocument;
	saveTarga32(activeFile);
	activeFile.close(SaveOptions.DONOTSAVECHANGES);
};

function CopyRoughness() 
{
	activeFile = app.activeDocument;
	activeFile.selection.selectAll();
	activeFile.selection.copy();
	activeFile.close(SaveOptions.DONOTSAVECHANGES);
	BCR();
};

function BCR()
{
	activeFile = app.activeDocument;
	makeChannel();
	clipboardToAlpha("Alpha 1");
	saveTarga32(activeFile);
	activeFile.close(SaveOptions.DONOTSAVECHANGES);
};

function clipboardToAlpha(alphaName) {
	var c2t = function (s) {
		return app.charIDToTypeID(s);
	};
	var s2t = function (s) {
		return app.stringIDToTypeID(s);
	};
	var descriptor = new ActionDescriptor();
	var descriptor2 = new ActionDescriptor();
	var reference = new ActionReference();
	reference.putName( s2t( "channel" ), alphaName );
	descriptor.putReference( c2t( "null" ), reference );
	executeAction( s2t( "select" ), descriptor, DialogModes.NO );
	descriptor2.putEnumerated( c2t( "AntA" ), s2t( "antiAliasType" ), s2t( "antiAliasNone" ));
	descriptor2.putClass( s2t( "as" ), s2t( "pixel" ));
	executeAction( s2t( "paste" ), descriptor2, DialogModes.NO );
}

function makeChannel()
{

    var idMk = charIDToTypeID( "Mk  " );

        var desc4 = new ActionDescriptor();

        var idNw = charIDToTypeID( "Nw  " );

            var desc5 = new ActionDescriptor();

            var idClrI = charIDToTypeID( "ClrI" );

            var idMskI = charIDToTypeID( "MskI" );

            var idMskA = charIDToTypeID( "MskA" );

            desc5.putEnumerated( idClrI, idMskI, idMskA );

            var idClr = charIDToTypeID( "Clr " );

                var desc6 = new ActionDescriptor();

                var idRd = charIDToTypeID( "Rd  " );

                desc6.putDouble( idRd, 255.000000 );

                var idGrn = charIDToTypeID( "Grn " );

                desc6.putDouble( idGrn, 0.000000 );

                var idBl = charIDToTypeID( "Bl  " );

                desc6.putDouble( idBl, 0.000000 );

            var idRGBC = charIDToTypeID( "RGBC" );

            desc5.putObject( idClr, idRGBC, desc6 );

            var idOpct = charIDToTypeID( "Opct" );

            desc5.putInteger( idOpct, 50 );

        var idChnl = charIDToTypeID( "Chnl" );

        desc4.putObject( idNw, idChnl, desc5 );

    executeAction( idMk, desc4, DialogModes.NO );

    // =======================================================

    var idFl = charIDToTypeID( "Fl  " );

        var desc7 = new ActionDescriptor();

        var idUsng = charIDToTypeID( "Usng" );

        var idFlCn = charIDToTypeID( "FlCn" );

        var idBckC = charIDToTypeID( "BckC" );

        desc7.putEnumerated( idUsng, idFlCn, idBckC );

        var idOpct = charIDToTypeID( "Opct" );

        var idPrc = charIDToTypeID( "#Prc" );

        desc7.putUnitDouble( idOpct, idPrc, 100.000000 );

        var idMd = charIDToTypeID( "Md  " );

        var idBlnM = charIDToTypeID( "BlnM" );

        var idNrml = charIDToTypeID( "Nrml" );

        desc7.putEnumerated( idMd, idBlnM, idNrml );

    executeAction( idFl, desc7, DialogModes.NO );
}

function selectChannel (colour){
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), stringIDToTypeID(colour) );
    desc.putReference( charIDToTypeID('null'), ref );
    executeAction( charIDToTypeID('slct'), desc, DialogModes.NO );
};

function saveTarga32(doc){

	var sourceName = decodeURI(doc.name).replace(/\.[^\.]+$/, '');
	var sourceName = sourceName.replace('_Albedo', '_BCR');
	var sourceName = sourceName.replace('_Normal', '_NMO');
	var sourceName = sourceName.replace('_Height', '_NHO');
	var sourceName = sourceName.replace(' ', '_');
	var sourceLocation = doc.path;
	
	var outputfolder = new Folder(doc.path + "/converted");
	if ( ! outputfolder.exists ) 
	{
		outputfolder.create()
	}	
	
	var destination = File(outputfolder + "/" + sourceName + ".tga");
	

	targaSaveOptions = new TargaSaveOptions();
	targaSaveOptions.alphaChannels = true;
	targaSaveOptions.resolution = TargaBitsPerPixels.THIRTYTWO;
	doc.saveAs(destination, targaSaveOptions, true, Extension.LOWERCASE);

};

dialog.onResizing = function() { this.layout.resize(); }

dialog.show();
