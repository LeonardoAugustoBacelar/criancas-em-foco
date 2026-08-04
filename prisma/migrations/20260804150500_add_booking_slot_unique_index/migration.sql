-- Impede, no banco, que duas reservas ativas (PENDENTE ou CONFIRMADA) existam
-- para o mesmo horario da mesma professora. Isso protege contra corrida entre
-- duas requisicoes simultaneas que passariam pela checagem em memoria da
-- aplicacao (findFirst) ao mesmo tempo, antes de qualquer uma ter sido criada.
-- Reservas CANCELADA/CONCLUIDA nao entram nessa restricao, pra nao impedir
-- reagendar o mesmo horario depois.
CREATE UNIQUE INDEX "Booking_teacherId_date_startTime_active_key"
ON "Booking" ("teacherId", "date", "startTime")
WHERE "status" IN ('PENDENTE', 'CONFIRMADA');
