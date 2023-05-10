export const statusInfoPupil = {
  nonPupilReg: `отменен в связи с техническими неполадками с вашей стороны. По правилам школы, он будет списан у вас с баланса.`,
  nonPupilIntro: `отменен в связи с техническими неполадками с вашей стороны. Урок возвращен вам на баланс. С вами свяжется мой коллега по поводу его переназначения.`,
  nonTutorReg: `отменен в связи с техническими неполадками со стороны преподавателя. Урок возвращен вам на баланс. В качестве извинения, я начислил вам бонусный урок.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
  nonTutorIntro: `отменен в связи с техническими неполадками со стороны преподавателя. Урок возвращен вам на баланс. С вами свяжется мой коллега по поводу его переназначения.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
  cancelNotCause: `отменен, поскольку не удалось установить причину неполадки. По правилам школы, урок возвращен вам на баланс.`,
  cancelBoth: `отменен в связи с техническими неполадками как с вашей стороны, так и со стороны преподавателя. По правилам школы, урок вернется вам на баланс.
Преподавателю предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
  cancelBug: `отменен в связи с техническими неполадками со стороны платформы. Урок возвращен вам на баланс. В качестве извинения, я начислил вам бонусный урок.`,
  finish: `по правилам школы считается завершенным, поскольку большая часть урока была проведена.`
};

export const statusInfoTutor = {
  nonPupilReg: `отменен в связи с техническими неполадками со стороны ученика. За урок вам начислена компенсация.
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
  nonPupilIntro: `отменен в связи с техническими неполадками со стороны ученика. За урок вам начислена компенсация.
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
  nonTutorReg: `отменен в связи с техническими неполадками с вашей стороны. По правилам школы, за урок полагается штраф в размере ставки урока.`,
  nonTutorIntro: `отменен в связи с техническими неполадками с вашей стороны. Штраф за данный урок не полагается.`,
  cancelNotCause: `отменен, поскольку не удалось установить причину неполадки. По правилам школы, оплата за урок не полагается.`,
  cancelBoth: `отменен в связи с техническими неполадками как с вашей стороны, так и со стороны ученика. По правилам школы, оплата за урок не полагается.
Ученику предоставлены все необходимые рекомендации, чтобы избежать неполадок с его стороны на будущих уроках.`,
  cancelBug: `отменен в связи с техническими неполадками со стороны платформы. За урок вам начислена компенсация.`,
  finish: statusInfoPupil.finish
};