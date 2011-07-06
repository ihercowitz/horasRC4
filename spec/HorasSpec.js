describe("Horas", function() {
   
       beforeEach(function() {
            horas = new Horas(); 
       }); 


       it('should return the current month and year by default', function() {
            month = new Date().getMonth()+1;
            if (month < 10)
                month = '0'+month;

            year = new Date().getYear() + 1900;
            expect(horas.gerahoras('07:55','12:00','17:00')['periodo']).toEqual(month+'/'+year);
       }); 


       it ('should accept a custom RC4 Chave', function(){
           timesheet = horas.gerahoras('07:55','12:00','17:00','teste');
           expect(timesheet.chave_rc4).toEqual('teste'); 

       });        

       it ('should set a CustomDate', function(){
           horas.setCustomDate(new Date(2011,6,0));
           timesheet = horas.gerahoras('07:55','12:00','17:00');
           expect(timesheet['periodo']).toEqual('06/2011');

       }); 

        it ('should generate a different value when use a different Chave RC4', function(){
           horas.setCustomDate(new Date(2011,2,0));
           timesheet = horas.gerahoras('07:55','12:00','17:00');
           expect(timesheet['horarios'][0].horario.entrada).toEqual('7:55');

        });

       it ('should return a json information', function(){
            timesheet = horas.gerahoras('07:55', '12:00', '17:00');
            expect(timesheet['periodo']).toEqual('07/2011');
        });

});
