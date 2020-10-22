import clsx from 'clsx';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { createStyles, makeStyles } from '@material-ui/styles';

import { bynder, kenticoKontent } from '../../appSettings.json';
import { element as elementTerms } from '../../terms.en-us.json';
import { loadModule } from '../../utilities/modules';
import { IBynderConfig } from '../shared/IBynderConfig';
import { IContext } from '../shared/models/customElement/IContext';
import { ICustomElement } from '../shared/models/customElement/ICustomElement';
import { AssetTile } from './AssetTile';

// Expose access to APIs
declare const CustomElement: ICustomElement<IBynderConfig>;
declare const BynderCompactView: BynderCompactView;

const useStyles = makeStyles(() =>
  createStyles({
    row: { display: 'flex', flexDirection: 'row', margin: '4px 0' },
    fullWidthCell: { flex: 1 },
    submit: { width: 'auto', margin: '0 auto' },
    list: { display: 'flex', flexWrap: 'wrap' },
    loadingForModal: { height: 500 },
  })
);

export const Bynder: FC = () => {
  const styles = useStyles();

  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [customElementConfig, setCustomElementConfig] = useState<IBynderConfig>();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [assets, setAssets] = useState<IAsset[]>();

  const onSuccess = useCallback((assets: IAsset[], additionalInfo?: AdditionalInfo) => {
    setAssets(assets);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!available) {
      const initCustomElement = (element: ICustomElement<IBynderConfig>, context: IContext) => {
        const elementValue = element.value !== null && (JSON.parse(element.value) as IAsset[]);

        if (elementValue) {
          setAssets(elementValue);
        }

        setAvailable(true);
        setElementEnabled(!element.disabled);

        if (element.config) {
          element.config.bynderOptions.onSuccess = onSuccess;

          setCustomElementConfig(element.config);
        }

        CustomElement.onDisabledChanged((disabled) => setElementEnabled(!disabled));
      };

      const setElementEnabled = (enabled: boolean) => {
        setEnabled(enabled);
      };

      loadModule(kenticoKontent.customElementScriptEndpoint, () => CustomElement.init(initCustomElement));
    }
  }, [available, onSuccess]);

  useEffect(() => {
    if (!loaded) {
      loadModule(bynder.compactViewScriptEndpoint, () => setLoaded(true));
    }
  }, [loaded]);

  useEffect(() => {
    if (available) {
      CustomElement.setHeight(document.documentElement.scrollHeight);
    }
  });

  const removeAsset = useCallback((asset: IAsset) => {
    setAssets((assets) => {
      if (assets) {
        assets = assets.filter((oldAsset) => oldAsset.id !== asset.id);
      }

      return assets;
    });
  }, []);

  useEffect(() => {
    if (available && loaded && enabled) {
      CustomElement.setValue(JSON.stringify(assets ?? null));
    }
  }, [available, loaded, enabled, assets]);

  return (
    <div>
      {available && (
        <div className={clsx(loading && styles.loadingForModal)}>
          {enabled && customElementConfig && (
            <>
              <div className={styles.row}>
                <div className={styles.fullWidthCell}>
                  <p>{elementTerms.enabledDescription}</p>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.fullWidthCell}>
                  <button
                    className={clsx(styles.submit, 'btn btn--primary btn--xs')}
                    onClick={() => {
                      setLoading(true);
                      BynderCompactView.open(customElementConfig.bynderOptions);
                    }}
                  >
                    {elementTerms.open}
                  </button>
                </div>
              </div>
              {assets !== undefined && (
                <div className={styles.row}>
                  <div className={clsx(styles.list, styles.fullWidthCell)}>
                    {assets.map((asset) => (
                      <AssetTile
                        asset={asset}
                        key={asset.id}
                        showActions={enabled}
                        onRemove={() => removeAsset(asset)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
