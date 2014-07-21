/*
Clase Notificacion ver. Beta 1.140720
Autor: Jaime Hormiga

 @param:
    - mensaje: texto que va a mostrar la notificacion
    - tipo : tipo de notificacion (por ahora solo tipo 1-normal)
    - pos: Array de dos valores que indica la posicion [V, H]
        .V: arr, med, abj
        .H: izq, cen, der

 TODO:
    - Ajustar icono para las tipo 2

 */
function Notificacion(mensaje, tipo, pos){

    //Propiedades
    this.elemento = null;
    this.tipo = tipo || 1;
    this.mensaje = mensaje;
    this.posicion = pos || ['arr','der'];
    this.duracion = 3000; //Se oculta tras estos milisegundos

    this.pantalla = null; //resolucion actual


    //------------  Configuracion

    this.icono = "img/info256.png";

    this.propiedades = {
        'width': '17%',
        'color': '#FFF',
        'font-size' : '1.1em',
        'background': '#000',
        'margin' : '1em',
        'padding': '1em',
        'text-align': 'center',
        'opacity' : '0.5',
        'display' : 'none',
        'position': 'absolute',
        'border-radius': '0.8em',
        '-moz-border-radius': '0.8em',
        '-webkit-border-radius': '0.8em'
    };
    //--------------------------------

    //Calcula la posicion donde se debe mostrar la notificacion
    this.calcularPosicion = function(){

        var resultado = {};

        var anchuraElemento = this.elemento.width();
        var alturaElemento = this.elemento.height();


        switch (this.posicion[0]){
            case 'arr':
                resultado.top = "0px";
                break;
            case 'abj':
                resultado.bottom = "0px";
                break;
            default:
                resultado.top = Math.abs(this.pantalla.alto-alturaElemento)/2+"px";
                break;
        }

        switch (this.posicion[1]){
            case 'izq':
                resultado.left = "0px";
                break;
            case 'der':
                resultado.right = "0px"
                break;
            default:
                resultado.left = Math.abs(this.pantalla.ancho-anchuraElemento)/2+"px";
                break;
        }


        //console.log(JSON.stringify(resultado));
        return resultado;
    }

    //Destruye el elemento
    this.destruir = function(){
        if (this.elemento != null){
            this.elemento.fadeOut(1000,function(){
              this.remove();
            });
            this.elemento = null;
        }
    }

    //Crea el elemento y lo enlaza al BODY
    //@param:
    //  - apagar: booleano. Si esta 'false' se evita la auto destruccion
    //
    this.crear = function(apagar){

        //Elimino otras posibles notificaciones
        if (this.elemento != null) this.destruir();

        //Creo elemento segun el tipo
        this.elemento = $('<div/>');
        this.elemento.addClass('notificacion');

        switch (this.tipo){
            case 2:
                this.elemento.html('<img src='+this.icono+'>'+this.mensaje);
                break;
            default:
                 this.elemento.html('<p>'+this.mensaje+'</p>');
                break;
        }

        this.elemento.appendTo('body');


        //aplico el css configurable
        for(var valor in this.propiedades){
            //console.log(valor+': '+this.propiedades[valor]);
            this.elemento.css(valor,this.propiedades[valor]);
        }
        //Aplico la posicion
        var posi = this.calcularPosicion();
        for(valor in posi){
            //console.log(valor+': '+posi[valor]);
           this.elemento.css(valor,posi[valor]);
        }


        //Eventos del elemento creado
        var self = this; //Para ajustar el scope de .on
        this.elemento.on({
            click: function(e){
                e.preventDefault();
                self.destruir();
            }
        });

        //Muestra el elemento
        this.elemento.fadeIn(600);

        //El elemento se auto-destruye tras la duracion indicada
        if (apagar){
            self = this;
            var timer = setTimeout(function(){
                        self.destruir();
                      },self.duracion);
        }

    }

    //Obtiene la Resolucion actual de la pantalla;
    this.calcularResolucion = function(){
        return { 'ancho':$(window).width(), 'alto':$(window).height()};

    }

    //--------------------- Metodos publicos --------------------

    //Hace todo lo necesario para mostrar la Notificacion
    //@param:
    //  - auto: booleano. Si esta 'false' se evita la auto destruccion
    //
    this.mostrar = function(auto){

        //Compruebo el tipo del parametro y pongo valor por defecto
        if (typeof(auto) != 'boolean') auto = true;

        this.pantalla = this.calcularResolucion();
        if (this.pantalla != null){

            this.crear(auto);
        }
        else{
            alert("ERROR: imposible calcular resolucion del dispositivo");
        }
    }

    this.mover = function (pos){
         this.posicion = pos || ['arr','der'];
    }

    //-----------------------------------------------------------
    //Ejecucion del constructor


}//class