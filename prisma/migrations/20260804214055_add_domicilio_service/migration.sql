-- CreateEnum
CREATE TYPE "BookingModality" AS ENUM ('ONLINE', 'DOMICILIO_CASA_ALUNO', 'DOMICILIO_CASA_PROFESSORA');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "address" TEXT,
ADD COLUMN     "modality" "BookingModality" NOT NULL DEFAULT 'ONLINE';

-- AlterTable
ALTER TABLE "TeacherProfile" ADD COLUMN     "domicilioAddress" TEXT,
ADD COLUMN     "offersDomicilio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pricePerHourDomicilio" DOUBLE PRECISION;
