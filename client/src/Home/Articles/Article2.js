import React from 'react';

const Article2 = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Importance des Radiographies Dentaires
      </h1>
      <div className="flex justify-center items-center">
        <img
          src="/images/article2.jpeg"
          alt="Radiographie Dentaire"
          className="w-1/2 rounded-lg shadow-lg block mx-auto"
        />
      </div>
      <br/>
      <p className="mt-6 text-lg">
        Les radiographies dentaires sont utilisées en dentisterie depuis plus de 100 ans. Elles fournissent des informations
        inestimables sur l’intérieur et l’extérieur de votre bouche, informations qui ne peuvent être obtenues par le seul
        examen visuel.
      </p>
      <h2 className="text-2xl font-semibold mt-6">Qu’est-ce qu’une radiographie dentaire ?</h2>
      <p className="mt-4 text-lg">
        Les radiographies dentaires permettent de visualiser les structures internes et externes de votre bouche, telles que
        les dents, mâchoires et masse osseuse. Elles aident à identifier les lésions et anomalies invisibles à l’œil nu.
      </p>
      <ul className="list-disc list-inside mt-4 text-lg">
        <li>Détection des caries cachées</li>
        <li>Identification des infections dentaires</li>
        <li>Évaluation de la perte osseuse</li>
        <li>Observation des dents incluses</li>
        <li>Analyse des anomalies de la mâchoire</li>
      </ul>
      <p>Grâce à la radiologie bucco-dentaire, le dentiste peut effectuer un diagnostic précis de l’état de santé de votre bouche et de votre dentition, et traiter au besoin, des problèmes dentaires avant qu’ils ne s’aggravent.

Le saviez-vous ? Les dentistes du Centre dentaire Mont-Royal respectent les Lignes directrices visant la protection du patient promues par l’Association dentaire canadienne en matière de radiographie dentaire.

Votre dentiste réalisera ainsi des radiographies uniquement si elles sont nécessaires pour établir un diagnostic fiable ou élaborer un plan de traitement adéquat.</p>
      <h2 className="text-2xl font-semibold mt-6">Les radiographies sont-elles nécessaires à chaque visite ?</h2>
      <p className="mt-4 text-lg">
      Si vous êtes un patient nouveau, votre praticien(ne) souhaitera possiblement effectuer des radiographies pour évaluer de façon plus précise votre état de santé bucco-dentaire. Il est toutefois possible de faire transférer les radiographies récemment effectuées dans un autre cabinet dentaire pour éviter de les refaire.

La fréquence à laquelle chaque patient(e) peut avoir besoin de radiographies varie néanmoins selon son état de santé buccale. Une bouche en bonne santé qui n’a pas eu de caries ou de problèmes parodontaux, osseux ou autres depuis quelques années n’aura sans doute pas besoin de radiographies dentaires à chaque visite. Si la situation dentaire est moins stable ou qu’un suivi dentaire doit être effectué, il est cependant probable que des radios seront nécessaires plus souvent pour surveiller l’évolution.
      </p>
      <h2 className="text-2xl font-semibold mt-6">Les radiographies dentaires sont-elles sécuritaires ?</h2>
      <p className="mt-4 text-lg">
      Il est important de garder à l’esprit que nous sommes quotidiennement exposés à différentes sources de radiation naturelle, provenant entre autres des rayons du soleil et du rayonnement d’autres astres.
Les récents équipements numériques (images générées à l’ordinateur) permettent d’utiliser des doses de radiation beaucoup plus faibles (jusqu’à 50 % de moins) que les équipements de radiographie conventionnels qui nécessitaient le développement de films.
En outre, le temps d’exposition est réduit de moitié avec la radiographie numérique. Utiliser un tablier de plomb pendant l’examen réduit également l’absorption des rayons X par le reste du corps.
À titre d’exemple une radio panoramique dentaire équivaudrait à la même dose de radiation « naturelle » qu’une exposition au soleil de 20 minutes.
Il est important de souligner que la prise de radiographies dentaires n’émet que de très faibles quantités de radiation. Les bénéfices qu’offrent les radiographies surpassent le risque mineur qu’elles soulèvent.
Tous les appareils radiographiques du Centre dentaire Mont-Royal sont numériques. Nous possédons un permis d’exploitation spécifique de radiologie diagnostique émis chaque année par l’Institut national de la santé publique (INSPQ). Nos équipements d’imagerie médicale – cônes et Panorex – sont également surveillés régulièrement par une agence indépendante.
Si vous avez des interrogations à ce sujet, n’hésitez pas à en faire part à votre dentiste lors de votre prochaine consultation.
      </p>
      <h2 className="text-2xl font-semibold mt-6">Conclusion</h2>
      <p className="mt-4 text-lg">
        En somme, les radiographies dentaires sont essentielles pour prévenir et diagnostiquer les problèmes bucco-dentaires
        avant qu’ils ne s’aggravent. Consultez votre dentiste pour un suivi adapté.
      </p>
    </div>
  );
};

export default Article2;
