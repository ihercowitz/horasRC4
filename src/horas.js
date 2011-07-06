var periodo;

function Horas(){ periodo = new Date(); };

Horas.prototype.gerahoras = function(entrada, almoco, saida, chave) {
    var mes_atual = getMonthAsMM(periodo);

    var ano_atual = (periodo.getYear()+1900);
    var mes_ano = (mes_atual) +'/'+ ano_atual;
    var total_dias = qtdDias(mes_atual, ano_atual);

    var horarios =new Array();

    
    chave = (chave == undefined) ? 'default': chave;

    var stream = getstream(chave+'-'+mes_atual+'-'+ano_atual,31*10);

    for (var i=1; i<=total_dias; i++ ) {
        var info = {};
        var weekday = new Date(ano_atual, mes_atual, i).getDay(); 
        info['dia'] = i; 
        info['weekday'] = weekday;

        if ( weekday % 6 ==0 ) {
               
            horarios.push(info)

        } else {
            info['horario'] = montahorario(entrada, almoco, saida, stream) 
            horarios.push(info);
        }
    }

    return {'periodo':mes_ano, 'chave_rc4':chave, 'horarios':horarios};    


};

Horas.prototype.setCustomDate = function(customDT) {
    periodo = customDT;
};



this.keysched = function(key) {
    s = new Array();
    var j = 0;

    for (var i=0; i < 256; i++) {
        s[i] = i;
    }


    for (i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        var x = s[i];
        s[i] = s[j];
        s[j] = x;
    }

    return s;
    
};

this.getstream = function(key, size) {
    s = keysched(key);
    var i =0;
    var j = 0;
    var tmp = '';

    var stream = new Array();

    for (var x = 0; x < size; x++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;

        tmp = s[i];
        s[i] = s[j];
        s[j] = tmp;

        stream.push(s[(s[i] + s[j]) % 256]);
    }

    return stream;

};

this.getNextSegment = function(stream) {
     
    ret = stream.shift();
    ret = ret % 5;

    return ret;
};


this.cutter = function(x, y) {        
    return (x > y)?[y, x-y]:[x,0];
};

this.adjustEnter = function(x) {
    return cutter(x,3);
};

this.adjustEatStart = function(x) {
    return cutter(x,2);
};

this.qtdDias = function (mes, ano) {
    return new Date(ano, mes, 0).getDate();
};

this.montahorario = function(entrada, almoco, saida, stream) {

    entradaSegment = getNextSegment(stream);
    almocoSegment = getNextSegment(stream);
    extraSegment = getNextSegment(stream);

    segments =  new Array();
    segments.push(entradaSegment);
    segments.push(almocoSegment);
    segments.push(extraSegment);

    
    raw = new Array();
    raw.push(adjustEnter(segments[0])[0]);
    raw.push(adjustEatStart(segments[1])[0]);
    raw.push(adjustEatStart(segments[2])[0]);

    horaalmoco = geraHorario(almoco,  geraMinutos(raw[1]));

    var dados = {}
    dados['entrada'] = geraHorario(entrada, geraMinutos(raw[0]));
    dados['saida_almoco'] = horaalmoco;
    dados['volta_almoco'] = geraHorario(horaalmoco,  geraMinutos(60 + (segments[2])));
    dados['saida'] = geraHorario(saida, geraMinutos(raw[2]));

    return dados;
};

this.geraHorario = function(horario, minutos) {

    var hora = horario.split(":");
    var horario = new Date();
    horario.setHours(parseInt(hora[0]), parseInt(hora[1]),0);
    horario = new Date(horario.getTime() +  minutos);

    return (horario.getHours() + ':' +horario.getFormatedMinutes());

};



this.geraMinutos = function(min) {
    return (min * 60 * 1000);
};


this.getMonthAsMM = function(data) {
    var month = data.getMonth()+1;
    if (month != undefined)
        month = month;

    return (month < 10 ? "0"+month: month );
};


Date.prototype.getFormatedMinutes = function() {
    var minutes = this.getMinutes();

    if (minutes<10) {
        minutes="0"+minutes;
    }

    return minutes;
};
